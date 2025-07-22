import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { PaginationParams } from '@/database/repositories/interfaces/pagination-params'
import { DocumentType, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { InMemoryDocumentsRepository } from './in-memory-documents-repository'

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

    const documents = this.inMemoryDocumentsRepository.items.filter(
      (item) => item.documentTypeId === documentType.id,
    )

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

  async findMany({ page, limit = 15 }: PaginationParams) {
    const total = this.items.length
    const last = Math.ceil(total / limit)
    const current = page
    const next = total > 0 && page < last ? page + 1 : null
    const prev = page > 1 ? page - 1 : null
    const first = total > 0 ? 1 : null

    const documentTypes = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * limit, page * limit)

    return {
      data: documentTypes,
      first,
      last,
      current,
      next,
      prev,
      total,
    }
  }

  async create(data: Prisma.DocumentTypeUncheckedCreateInput) {
    const documentType = {
      id: randomUUID(),
      name: data.name,
      metadata: JSON.stringify(data.metadata),
      isActive: data.isActive ?? true,
      companyId: data.companyId,
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
