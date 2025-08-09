import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { RegistryTypeEvent } from '../registry-type.event'

@Injectable()
export class RegistryTypeCreatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('registry-type.created')
  async handle(event: RegistryTypeEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'registry-type.created',
        registryTypeId: event.registryTypeId,
        userId: event.userId,
      },
    })
  }
}
