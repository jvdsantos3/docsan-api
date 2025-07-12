import { OwnersRepository } from '@/database/repositories/owners-repository'
import { Owner, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryOwnersRepository implements OwnersRepository {
  public items: Owner[] = []

  async findById(id: string) {
    const owners = this.items.find((item) => item.id === id)

    if (!owners) {
      return null
    }

    return owners
  }

  async findByEmail(email: string) {
    const owners = this.items.find((item) => item.email === email)

    if (!owners) {
      return null
    }

    return owners
  }

  async create(data: Prisma.OwnerCreateInput) {
    const owners = {
      id: randomUUID(),
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(owners)

    return owners
  }
}
