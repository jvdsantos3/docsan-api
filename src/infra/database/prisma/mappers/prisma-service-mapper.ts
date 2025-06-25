import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Professional } from '@/domain/enterprise/entities/professional'
import { Service } from '@/domain/enterprise/entities/service'
import { Slug } from '@/domain/enterprise/entities/value-objects/slug'
import { Service as PrismaService, Prisma } from '@prisma/client'

type ServiceWithProfessional = Prisma.ServiceGetPayload<{
  include: { professional: true }
}>

export class PrismaServiceMapper {
  static toDomain(raw: PrismaService): Service {
    return Service.create(
      {
        professionalId: new UniqueEntityID(raw.professionalId),
        title: raw.title,
        slug: Slug.create(raw.slug),
        content: raw.content,
        description: raw.description,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomainWithRelations(raw: ServiceWithProfessional): Service {
    return Service.create(
      {
        professionalId: new UniqueEntityID(raw.professionalId),
        title: raw.title,
        slug: Slug.create(raw.slug),
        content: raw.content,
        description: raw.description,
        professional: Professional.create(raw.professional),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      professionalId: service.professionalId.toString(),
      id: service.id.toString(),
      title: service.title,
      slug: service.slug.value,
      content: service.content,
      description: service.description,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }
  }
}
