import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Professional } from '@/domain/enterprise/entities/professional'
import { Professional as PrismaProfessional, Prisma } from '@prisma/client'

export class PrismaProfessionalMapper {
  static toDomain(raw: PrismaProfessional): Professional {
    return Professional.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        birthDate: raw.birthDate,
        email: raw.email,
        password: raw.password,
        phone: raw.phone,
        fieldExpertise: raw.fieldExpertise,
        professionalRegistry: raw.professionalRegistry,
        registryUf: raw.registryUf,
        cnae: raw.cnae,
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

  static toPrisma(
    professional: Professional,
  ): Prisma.ProfessionalUncheckedCreateInput {
    return {
      id: professional.id.toString(),
      name: professional.name,
      cpf: professional.cpf,
      birthDate: professional.birthDate,
      email: professional.email,
      password: professional.password,
      phone: professional.phone,
      fieldExpertise: professional.fieldExpertise,
      professionalRegistry: professional.professionalRegistry,
      registryUf: professional.registryUf,
      cnae: professional.cnae,
      zipCode: professional.zipCode,
      uf: professional.uf,
      city: professional.city,
      street: professional.street,
      number: professional.number,
      neighborhood: professional.neighborhood,
      complement: professional.complement,
    }
  }
}
