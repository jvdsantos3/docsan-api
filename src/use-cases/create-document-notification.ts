import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Injectable } from '@nestjs/common'
import { DocumentNotificationsRepository } from '@/database/repositories/document-notifications-repository'
import { DocumentNotFoundError } from './errors/document-not-found-error'
import { isBefore, isSameDay, subMonths, subWeeks } from 'date-fns'
import { DocumentNotification } from '@prisma/client'
import { DocumentOverdueError } from './errors/document-overdue-error'

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

    if (
      isBefore(document.duedate, new Date()) ||
      isSameDay(document.duedate, new Date())
    ) {
      throw new DocumentOverdueError()
    }

    let scheduleDate: Date

    if (period === 'week') {
      scheduleDate = subWeeks(new Date(document.duedate), time)
    } else {
      scheduleDate = subMonths(new Date(document.duedate), time)
    }

    const notification =
      await this.documentNotificationsRepository.findByDocumentId(documentId)

    if (notification) {
      const updatedNotification =
        await this.documentNotificationsRepository.save({
          id: notification.id,
          scheduledAt: scheduleDate,
        })

      return {
        documentNotification: updatedNotification,
      }
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
