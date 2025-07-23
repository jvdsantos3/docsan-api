// src/events/events/document-type-created.event.ts
import { User } from '@/use-cases/interfaces/use'

export class DocumentTypeCreatedEvent {
  constructor(
    public readonly user: User,
    public readonly companyId: string,
    public readonly documentTypeId: string,
  ) {}
}
