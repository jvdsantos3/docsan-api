import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { RegistryTypeEvent } from '../registry-type.event'

@Injectable()
export class RegistryTypeUpdatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('registry-type.updated')
  async handle(event: RegistryTypeEvent) {
    const action = 'registry-type.updated'

    await this.prisma.actionLog.create({
      data: {
        action,
        registryTypeId: event.registryTypeId,
        userId: event.userId,
      },
    })
  }
}
