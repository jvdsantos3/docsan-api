import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { SendMailData } from '@/queue/processors/mail.processor'

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
