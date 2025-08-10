import { EnvService } from './../../env/env.service'
import { RedisService } from '@/redis/redis.service'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class ChatLimitGuard implements CanActivate {
  constructor(
    private envService: EnvService,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    if (request.user) {
      return true
    }

    const ip = this.getClientIp(request)
    console.log('Client IP:', ip)

    if (!ip) {
      throw new HttpException(
        'Unable to identify client IP address.',
        HttpStatus.BAD_REQUEST,
      )
    }

    const limit = this.envService.get('CHAT_LIMIT') || 3

    const count = await this.redisService.incrementChatLimit(ip)

    if (count > limit) {
      throw new HttpException(
        'Question limit exceeded.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    const response = context.switchToHttp().getResponse()
    response.setHeader('X-RateLimit-Limit', limit)
    response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count))

    return true
  }

  private getClientIp(request: Request): string | null {
    const ipHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'cf-connecting-ip',
      'fastly-client-ip',
      'x-cluster-client-ip',
      'x-forwarded',
      'forwarded-for',
      'forwarded',
    ]

    for (const header of ipHeaders) {
      const value = request.headers[header]

      if (value) {
        const ip = this.extractIpFromHeader(value)
        if (ip && this.isValidIp(ip)) {
          return ip
        }
      }
    }

    const connectionIp = request.socket.remoteAddress

    if (connectionIp && this.isValidIp(connectionIp)) {
      return connectionIp
    }

    return null
  }

  private extractIpFromHeader(value: string | string[]): string | null {
    const ipString = Array.isArray(value) ? value[0] : value

    const ips = ipString.split(',').map((ip) => ip.trim())

    for (const ip of ips) {
      if (this.isValidIp(ip)) {
        return ip
      }
    }

    return null
  }

  private isValidIp(ip: string): boolean {
    const cleanIp = ip.replace(/^::ffff:/, '')

    const ipv4Regex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/

    const isValid = ipv4Regex.test(cleanIp) || ipv6Regex.test(cleanIp)

    // if (isValid && this.envService.get('EXCLUDE_PRIVATE_IPS') === 'true') {
    //   return !this.isPrivateIp(cleanIp)
    // }

    return isValid
  }

  private isPrivateIp(ip: string): boolean {
    const privateRanges = [
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^::1$/,
      /^fc00:/,
    ]

    return privateRanges.some((range) => range.test(ip))
  }
}
