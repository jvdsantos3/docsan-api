import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { DocumentTypeEvent } from '../document-type.event'

@Injectable()
export class DocumentTypeCreatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('document-type.created')
  async handle(event: DocumentTypeEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'document-type.created',
        companyId: event.companyId,
        documentTypeId: event.documentTypeId,
        userId: event.userId,
      },
    })
  }
}
