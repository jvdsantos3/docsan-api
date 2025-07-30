import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Injectable } from '@nestjs/common'
import { DocumentNotificationsRepository } from '@/database/repositories/document-notifications-repository'
import { DocumentNotFoundError } from './errors/document-not-found-error'
import { subMonths, subWeeks } from 'date-fns'
import { DocumentNotification } from '@prisma/client'

interface CreateDocumentNotificationUseCaseRequest {
  documentId: string
  time: number
  period: 'week' | 'month'
}

interface CreateDocumentNotificationUseCaseResponse {
  documentNotification: DocumentNotification
}

@Injectable()
export class CreateDocumentNotifictionUseCase {
  constructor(
    private documentsRepository: DocumentsRepository,
    private documentNotificationsRepository: DocumentNotificationsRepository,
  ) {}

  async execute({
    documentId,
    time,
    period,
  }: CreateDocumentNotificationUseCaseRequest): Promise<CreateDocumentNotificationUseCaseResponse> {
    const document = await this.documentsRepository.findById(documentId)

    if (!document) {
      throw new DocumentNotFoundError()
    }

    let scheduleDate: Date

    if (period === 'week') {
      scheduleDate = subWeeks(new Date(document.duedate), time)
    } else {
      scheduleDate = subMonths(new Date(document.duedate), time)
    }

    const documentNotification =
      await this.documentNotificationsRepository.create({
        documentId,
        scheduledAt: scheduleDate,
      })

    return {
      documentNotification,
    }
  }
}
