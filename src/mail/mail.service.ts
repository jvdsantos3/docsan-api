import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.seudominio.com',
      port: 587,
      secure: false, // true para 465, false para outras
      auth: {
        user: 'seu@email.com',
        pass: 'sua-senha',
      },
    })
  }

  async sendMail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: '"Notificações" <notificacoes@seudominio.com>',
      to,
      subject,
      html,
    })
  }
}
