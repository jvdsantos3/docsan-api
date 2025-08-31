import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'
import { ZohoService } from '@/mail/zoho.service'
import { ZohoTimeoutError } from '@/mail/errors/zoho-timeout.error'
import { Logger } from '@nestjs/common'
import { MailService } from '@/mail/mail.service'
import { EnvService } from '@/env/env.service'

export interface SendMailData {
  to: string
  subject: string
  template: string
  context?: Record<string, unknown>
}

@Processor(QUEUE_NAMES.MAILS)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name)

  constructor(
    private zohoService: ZohoService,
    private mailService: MailService,
    private env: EnvService,
  ) {}

  @Process('send-email')
  async handleSendEmail(job: Job<SendMailData>) {
    const { to, subject, template, context } = job.data

    try {
      if (this.env.get('NODE_ENV') === 'development') {
        await this.mailService.sendMail({ to, subject, template, context })
      } else {
        await this.zohoService.sendEmail({ to, subject, template, context })
      }
    } catch (error: any) {
      if (error instanceof ZohoTimeoutError) {
        this.logger.warn(
          `Timeout sending email to ${to}. Retrying in 30 seconds... (Attempt ${job.attemptsMade})`,
        )

        throw error
      }

      this.logger.error(`Failed to send email to ${to}:`, error)

      throw error
    }
  }
}
