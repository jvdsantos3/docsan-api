import { Indexation, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { IndexationsRepository } from '@/database/repositories/indexations-repository'

export class InMemoryIndexationsRepository implements IndexationsRepository {
  public items: Indexation[] = []

  async findById(id: string) {
    const indexation = this.items.find((item) => item.id === id)

    if (!indexation) {
      return null
    }

    return indexation
  }

  async create(data: Prisma.IndexationUncheckedCreateInput) {
    const indexation = {
      id: randomUUID(),
      values: data.values as Prisma.JsonValue,
      documentId: data.documentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(indexation)

    return indexation
  }
}
