import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { MailService } from '@/mail/mail.service'
import { QUEUE_NAMES } from '@/queue/queue.constants'

@Processor(QUEUE_NAMES.MAILS)
export class MailProcessor {
  constructor(private mailService: MailService) {}

  @Process('send-email')
  async handleSendApprovalEmail(job: Job) {
    const { to, subject, html } = job.data
    await this.mailService.sendMail(to, subject, html)
  }
}
