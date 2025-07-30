import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { DocumentTypeEvent } from '../document-type.event'

@Injectable()
export class DocumentTypeUpdatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('document-type.updated')
  async handle(event: DocumentTypeEvent) {
    const action = 'document-type.updated'

    const log = await this.prisma.actionLog.findFirst({
      where: {
        action,
        companyId: event.companyId,
        documentTypeId: event.documentTypeId,
      },
    })

    if (!log) {
      return await this.prisma.actionLog.create({
        data: {
          action: 'document-type.updated',
          companyId: event.companyId,
          documentTypeId: event.documentTypeId,
          userId: event.userId,
        },
      })
    }

    await this.prisma.actionLog.update({
      where: {
        id: log.id,
      },
      data: {
        userId: event.userId,
      },
    })
  }
}
