import { Module, Global } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { QUEUE_NAMES } from './queue.constants'
import { EnvService } from '@/env/env.service'
import { EnvModule } from '@/env/env.module'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        redis: {
          host: env.get('REDIS_HOST'),
          port: env.get('REDIS_PORT'),
        },
        limiter: {
          max: 1,
          duration: 1000,
        },
      }),
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.NOTIFICATIONS,
    }),
  ],
  exports: [BullModule],
  providers: [EnvService],
})
export class QueueModule {}
