// src/queue/queue.module.ts
import { Module, Global } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { QUEUE_NAMES } from './queue.constants'

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.NOTIFICATIONS,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
