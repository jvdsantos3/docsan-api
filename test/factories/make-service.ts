import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Service, ServiceProps } from '@/domain/enterprise/entities/service'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaServiceMapper } from '@/infra/database/prisma/mappers/prisma-service-mapper'

export function makeService(
  override: Partial<ServiceProps> = {},
  id?: UniqueEntityID,
) {
  const service = Service.create(
    {
      professionalId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      description: faker.lorem.text(),
      content: faker.lorem.paragraphs(),
      ...override,
    },
    id,
  )

  return service
}

@Injectable()
export class ServiceFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaService(data: Partial<ServiceProps> = {}): Promise<Service> {
    const service = makeService(data)

    await this.prisma.service.create({
      data: PrismaServiceMapper.toPrisma(service),
    })

    return service
  }
}
