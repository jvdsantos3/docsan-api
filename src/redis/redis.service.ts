import { EnvService } from '@/env/env.service'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis

  constructor(private env: EnvService) {
    this.redis = new Redis({
      host: this.env.get('REDIS_HOST'),
      port: this.env.get('REDIS_PORT'),
    })
  }

  async incrementChatLimit(ip: string): Promise<number> {
    const key = `chat_limit:${ip}`
    const count = await this.redis.incr(key)

    if (count === 1) {
      await this.redis.expire(key, this.env.get('CHAT_LIMIT_EXPIRE'))
    }

    return count
  }

  async getChatLimit(ip: string): Promise<number> {
    const key = `chat_limit:${ip}`
    const value = await this.redis.get(key)
    return parseInt(value || '0', 10)
  }

  async onModuleDestroy() {
    await this.redis.quit()
  }
}
