import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { CnaeEvent } from '../cnae.event'

@Injectable()
export class CnaeUpdatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('cnae.updated')
  async handle(event: CnaeEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'cnae.updated',
        cnaeId: event.cnaeId,
        userId: event.userId,
      },
    })
  }
}
