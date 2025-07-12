import { CompaniesRepository } from '@/database/repositories/companies-repository'
import { Company, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public items: Company[] = []

  async findById(id: string) {
    const companies = this.items.find((item) => item.id === id)

    if (!companies) {
      return null
    }

    return companies
  }

  async create(data: Prisma.CompanyUncheckedCreateInput) {
    const companies = {
      id: randomUUID(),
      name: data.name,
      tradeName: data.tradeName,
      cnpj: data.cnpj,
      cnae: data.cnae,
      addressId: data.addressId,
      ownerId: data.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(companies)

    return companies
  }
}
