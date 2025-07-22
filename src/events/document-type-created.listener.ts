// src/events/listeners/document-type-created.listener.ts
import { OnEvent } from '@nestjs/event-emitter'
import { Injectable } from '@nestjs/common'
import { DocumentTypeCreatedEvent } from '../events/document-type-created.event'
import { AuthzService } from '@/authz/authz.service'

@Injectable()
export class DocumentTypeCreatedListener {
  constructor(private readonly authzService: AuthzService) {}

  @OnEvent('document-type.created')
  async handle(event: DocumentTypeCreatedEvent) {
    await this.authzService.logAction(
      event.user,
      event.companyId,
      'document-type.create',
      'DOCUMENT_TYPE',
      event.documentTypeId,
    )
  }
}
