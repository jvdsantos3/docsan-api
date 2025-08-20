import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

export interface SendMailData {
  to: string
  subject: string
  template: string
  context?: Record<string, unknown>
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(data: SendMailData) {
    await this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      template: data.template,
      context: data.context,
    })
  }
}
