import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { DocumentEvent } from '../document.event'

@Injectable()
export class DocumentCreatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('document.created')
  async handle(event: DocumentEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'document.created',
        companyId: event.companyId,
        documentId: event.documentId,
        userId: event.userId,
      },
    })
  }
}
