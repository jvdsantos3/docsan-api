import { InMemoryCompaniesRepository } from './in-memory-companies-repository'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { Owner, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryOwnersRepository implements OwnersRepository {
  public items: Owner[] = []

  constructor(
    private inMemoryCompaniesRepository: InMemoryCompaniesRepository,
  ) {}

  async findById(id: string) {
    const owners = this.items.find((item) => item.id === id)

    if (!owners) {
      return null
    }

    return owners
  }

  async findByIdWithCompany(id: string) {
    const owners = this.items.find((item) => item.id === id)

    if (!owners) {
      return null
    }

    const company =
      (await this.inMemoryCompaniesRepository.findById(owners.companyId)) ??
      null

    return {
      ...owners,
      company,
    }
  }

  async findByEmail(email: string) {
    const owners = this.items.find((item) => item.email === email)

    if (!owners) {
      return null
    }

    return owners
  }

  async findByCpf(cpf: string) {
    const owners = this.items.find((item) => item.cpf === cpf)

    if (!owners) {
      return null
    }

    return owners
  }

  async create(data: Prisma.OwnerUncheckedCreateInput) {
    const owners = {
      id: randomUUID(),
      companyId: data.companyId,
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
