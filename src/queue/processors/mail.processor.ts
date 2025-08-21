import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'
import { ZohoService } from '@/mail/zoho.service'
import { ZohoTimeoutError } from '@/mail/errors/zoho-timeout.error'
import { Logger } from '@nestjs/common'

@Processor(QUEUE_NAMES.MAILS)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name)

  constructor(private zohoService: ZohoService) {}

  @Process('send-email')
  async handleSendApprovalEmail(job: Job) {
    const { to, subject, template, context } = job.data

    try {
      await this.zohoService.sendEmail(to, subject, template, context)
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
