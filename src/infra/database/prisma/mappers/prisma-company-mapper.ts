import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/enterprise/entities/company'
import { Company as PrismaCompany, Prisma } from '@prisma/client'

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create(
      {
        name: raw.name,
        tradeName: raw.tradeName,
        cnpj: raw.cnpj,
        email: raw.email,
        password: raw.password,
        cnae: raw.cnae,
        phone: raw.phone,
        responsibleName: raw.responsibleName,
        responsibleCpf: raw.responsibleCpf,
        zipCode: raw.zipCode,
        uf: raw.uf,
        city: raw.city,
        street: raw.street,
        number: raw.number,
        neighborhood: raw.neighborhood,
        complement: raw.complement,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      name: company.name,
      tradeName: company.tradeName,
      cnpj: company.cnpj,
      email: company.email,
      password: company.password,
      cnae: company.cnae,
      phone: company.phone,
      responsibleName: company.responsibleName,
      responsibleCpf: company.responsibleCpf,
      zipCode: company.zipCode,
      uf: company.uf,
      city: company.city,
      street: company.street,
      number: company.number,
      neighborhood: company.neighborhood,
      complement: company.complement,
    }
  }
}
