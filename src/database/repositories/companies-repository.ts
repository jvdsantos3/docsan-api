import { Company, Prisma } from '@prisma/client'

export abstract class CompaniesRepository {
  abstract findById(id: string): Promise<Company | null>
  abstract create(data: Prisma.CompanyUncheckedCreateInput): Promise<Company>
}
