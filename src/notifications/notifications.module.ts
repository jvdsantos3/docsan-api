import { Module } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { NotificationsProcessor } from './notifications.processor'
import { PrismaService } from '@/database/prisma.service'
import { MailService } from '@/mail/mail.service'
import { EnvService } from '@/env/env.service'

@Module({
  providers: [
    EnvService,
    NotificationsService,
    NotificationsProcessor,
    PrismaService,
    MailService,
  ],
})
export class NotificationsModule {}
