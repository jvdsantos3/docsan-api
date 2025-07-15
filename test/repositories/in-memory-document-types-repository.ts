import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { PaginationParams } from '@/database/repositories/interfaces/pagination-params'
import { DocumentType, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { InMemoryDocumentsRepository } from './in-memory-document-types-repository copy'

export class InMemoryDocumentTypesRepository
  implements DocumentTypesRepository
{
  public items: DocumentType[] = []

  constructor(
    private inMemoryDocumentsRepository: InMemoryDocumentsRepository,
  ) {}

  async findById(id: string) {
    const documentType = this.items.find((item) => item.id === id)

    if (!documentType) {
      return null
    }

    return documentType
  }

  async findByIdWithDocuments(id: string) {
    const documentType = this.items.find((item) => item.id === id)

    if (!documentType) {
      return null
    }

    const documents = this.inMemoryDocumentsRepository.items.filter(item => item.documentTypeId === documentType.id)

    return {
      ...documentType,
      documents,
    }
  }

  async findByName(name: string) {
    const documentType = this.items.find((item) => item.name === name)

    if (!documentType) {
      return null
    }

    return documentType
  }

  async findMany({ page }: PaginationParams) {
    const documentTypes = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 10, page * 10)

    return documentTypes
  }

  async create(data: Prisma.DocumentTypeUncheckedCreateInput) {
    const documentType = {
      id: randomUUID(),
      name: data.name,
      metadata: JSON.stringify(data.metadata),
      isActive: data.isActive ?? true,
      companyId: data.companyId,
      professionalId: data.professionalId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(documentType)

    return documentType
  }

  async save(data: DocumentType) {
    const checkInIndex = this.items.findIndex((item) => item.id === data.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = data
    }

    return data
  }

  async delete(data: DocumentType) {
    const itemIndex = this.items.findIndex((item) => item.id === data.id)

    this.items.splice(itemIndex, 1)
  }
}
