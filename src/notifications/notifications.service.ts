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
    @InjectQueue(QUEUE_NAMES.NOTIFICATIONS)
    private readonly notificationsQueue: Queue,
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
      await this.notificationsQueue.add(
        'send-notification',
        {
          documentId: notification.documentId,
          scheduledAt: notification.scheduledAt,
        },
        {
          delay: 5000, // 5s
        },
      )
    }
  }
}
