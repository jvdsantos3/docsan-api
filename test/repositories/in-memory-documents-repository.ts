import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Document, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryDocumentsRepository implements DocumentsRepository {
  public items: Document[] = []

  async findById(id: string) {
    const document = this.items.find((item) => item.id === id)

    if (!document) {
      return null
    }

    return document
  }

  async findFirstByDocumentId(id: string) {
    const document = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter((item) => item.documentTypeId === id)[0]

    return document
  }

  async fetchByDocumentTypeId(id: string) {
    const documents = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .filter((item) => item.documentTypeId === id)

    return documents
  }

  async create(data: Prisma.DocumentUncheckedCreateInput) {
    const document = {
      id: randomUUID(),
      name: data.name,
      url: data.url,
      version: data.version,
      companyId: data.companyId,
      documentTypeId: data.documentTypeId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(document)

    return document
  }
}
