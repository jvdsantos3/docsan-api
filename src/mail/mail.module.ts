import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { MailService } from '@/mail/mail.service'
import { EnvService } from '@/env/env.service'

@Module({
  imports: [ScheduleModule],
  providers: [MailService, EnvService],
  exports: [MailService],
})
export class MailModule {}
