import { Company } from '@/domain/enterprise/entities/company'

export abstract class CompaniesRepository {
  abstract findByEmail(email: string): Promise<Company | null>
  abstract create(company: Company): Promise<void>
}
