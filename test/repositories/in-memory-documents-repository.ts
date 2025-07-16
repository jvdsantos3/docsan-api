import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Document, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryDocumentsRepository
  implements DocumentsRepository
{
  public items: Document[] = []

  async findById(id: string) {
    const document = this.items.find((item) => item.id === id)

    if (!document) {
      return null
    }

    return document
  }

  async create(data: Prisma.DocumentUncheckedCreateInput) {
    const document = {
      id: randomUUID(),
      name: data.name,
      url: data.url,
      companyId: data.companyId,
      documentTypeId: data.documentTypeId,
      indexationId: data.indexationId,
      professionalId: data.professionalId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(document)

    return document
  }
}
