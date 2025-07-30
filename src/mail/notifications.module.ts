import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { MailService } from '@/mail/mail.service'

@Module({
  imports: [ScheduleModule],
  providers: [MailService],
})
export class NotificationsModule {}
