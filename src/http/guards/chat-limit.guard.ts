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

    const forwarded = request.headers['x-forwarded-for']

    if (!forwarded) {
      throw new HttpException(
        'IP address not found.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    let ip: string

    if (typeof forwarded === 'string') {
      ip = forwarded.split(',')[0].trim()
    } else {
      ip = forwarded[0]
    }

    const count = await this.redisService.incrementChatLimit(ip)

    if (count > this.envService.get('CHAT_LIMIT')) {
      throw new HttpException(
        'Question limit exceeded.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    return true
  }
}
