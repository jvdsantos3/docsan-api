import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { PrismaService } from '@/database/prisma.service'
import { QueueModule } from '@/queue/queue.module'
import { EnvModule } from '@/env/env.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [ScheduleModule.forRoot(), QueueModule, EnvModule],
  providers: [PrismaService, NotificationsService],
  exports: [NotificationsService],
})
export class SchedulesModule {}
