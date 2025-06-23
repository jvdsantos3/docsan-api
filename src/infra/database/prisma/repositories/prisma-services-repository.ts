import { PaginationParams } from '@/core/repositories/pagination-params'
import { ServicesRepository } from '@/domain/application/repositories/services-repository'
import { Service } from '@/domain/enterprise/entities/service'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaServiceMapper } from '../mappers/prisma-service-mapper'

@Injectable()
export class PrismaServicesRepository implements ServicesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
    })

    if (!service) {
      return null
    }

    return PrismaServiceMapper.toDomain(service)
  }

  async findBySlug(slug: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: {
        slug,
      },
    })

    if (!service) {
      return null
    }

    return PrismaServiceMapper.toDomain(service)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return services.map(PrismaServiceMapper.toDomain)
  }

  async create(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service)

    await this.prisma.service.create({
      data,
    })
  }
}
