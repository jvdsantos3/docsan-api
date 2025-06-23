import { CompaniesRepository } from '@/domain/application/repositories/companies-repository'
import { Company } from '@/domain/enterprise/entities/company'

export class InMemoryCompaniesRepository implements CompaniesRepository {
  public items: Company[] = []

  async findByEmail(email: string) {
    const company = this.items.find((item) => item.email === email)

    if (!company) {
      return null
    }

    return company
  }

  async create(company: Company) {
    this.items.push(company)
  }
}
