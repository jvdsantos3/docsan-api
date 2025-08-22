import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { startOfDay, endOfDay } from 'date-fns'
import { PrismaService } from '@/database/prisma.service'
import { QUEUE_NAMES } from '@/queue/queue.constants'

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.MAILS) private mailQueue: Queue,
  ) {}

  // Daily at 8:00 AM
  @Cron('0 8 * * *')
  async checkDailyNotifications() {
    const now = new Date()

    const notifications = await this.prisma.documentNotification.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
    })

    for (const notification of notifications) {
      const document = await this.prisma.document.findUnique({
        where: { id: notification.documentId },
        include: {
          company: {
            include: {
              owner: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      })

      if (!document) {
        return
      }

      if (!document.company.owner) {
        return
      }

      const email = document.company.owner.user.email

      await this.mailQueue.add(
        'send-email',
        {
          to: email,
          subject: 'Lembrete de vencimento de documento',
          template: 'document-notification',
          context: {
            name: document.name,
            duedate: new Date(document.duedate).toLocaleDateString(),
          },
        },
        {
          delay: 3000,
          attempts: 3,
          backoff: {
            type: 'fixer',
            delay: 30000,
          },
        },
      )
    }
  }
}
