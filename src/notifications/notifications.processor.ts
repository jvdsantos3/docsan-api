import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { MailService } from '@/mail/mail.service'
import { PrismaService } from '@/database/prisma.service'
import { QUEUE_NAMES } from '@/queue/queue.constants'

@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationsProcessor {
  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  @Process('send-notification')
  async handleSendNotification(job: Job) {
    const { documentId, scheduledAt } = job.data

    console.log(documentId, scheduledAt)

    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        company: {
          include: {
            owner: {
              include: {
                user: true,
              }
            },
          }
        }
      },
    })

    if (!document) {
      return
    }

    // const email = document.company.owner?.user.email



    // await this.mailService.sendMail(
    //   email,
    //   'Lembrete de vencimento de documento',
    //   `
    //     <p>Olá,</p>
    //     <p>O documento <strong>${document.title}</strong> está agendado para vencimento em breve.</p>
    //     <p>Data de vencimento: <strong>${new Date(document.duedate).toLocaleDateString()}</strong></p>
    //     <p>Esse é um lembrete automático do sistema.</p>
    //   `,
    // )

    // console.log(`✉️ Email enviado para ${email} sobre documento ${documentId}`)
  }
}
