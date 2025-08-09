import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { CnaeEvent } from '../cnae.event'

@Injectable()
export class CnaeCreatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('cnae.created')
  async handle(event: CnaeEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'cnae.created',
        cnaeId: event.cnaeId,
        userId: event.userId,
      },
    })
  }
}
