import { Module, Global } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { QUEUE_NAMES } from './queue.constants'
import { EnvService } from '@/env/env.service'
import { EnvModule } from '@/env/env.module'
import { MailProcessor } from './processors/mail.processor'
import { MailService } from '@/mail/mail.service'

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
    BullModule.registerQueue(
      {
        name: QUEUE_NAMES.NOTIFICATIONS,
      },
      {
        name: QUEUE_NAMES.MAILS,
      },
    ),
  ],
  exports: [BullModule],
  providers: [EnvService, MailProcessor, MailService],
})
export class QueueModule {}
