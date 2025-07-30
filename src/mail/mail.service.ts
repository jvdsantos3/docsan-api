import { EnvService } from '@/env/env.service'
import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter

  constructor(private env: EnvService) {
    this.transporter = nodemailer.createTransport({
      host: this.env.get('MAIL_HOST'),
      port: this.env.get('MAIL_PORT'),
      secure: false, // true para 465, false para outras
      auth: {
        user: this.env.get('MAIL_USER'),
        pass: this.env.get('MAIL_PASSWORD'), 
      },
    })
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: 'docsan@gmail.com',
      to,
      subject,
      html,
    })
  }
}
