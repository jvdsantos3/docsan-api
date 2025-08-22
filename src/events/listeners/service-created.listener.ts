import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { ServiceEvent } from '../service.event'

@Injectable()
export class ServiceCreatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('service.created')
  async handle(event: ServiceEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'service.created',
        serviceId: event.serviceId,
        userId: event.userId,
      },
    })
  }
}
