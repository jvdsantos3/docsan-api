import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Service } from '@/domain/enterprise/entities/service'
import { Slug } from '@/domain/enterprise/entities/value-objects/slug'
import { Service as PrismaService, Prisma } from '@prisma/client'

export class PrismaServiceMapper {
  static toDomain(raw: PrismaService): Service {
    return Service.create(
      {
        title: raw.title,
        content: raw.content,
        professionalId: new UniqueEntityID(raw.professionalId),
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      id: service.id.toString(),
      professionalId: service.professionalId.toString(),
      title: service.title,
      content: service.content,
      slug: service.slug.value,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }
  }
}
