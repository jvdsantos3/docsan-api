import { Injectable } from '@nestjs/common'
import { Cnae, Prisma, RegistryType } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '../interfaces/pagination-params'
import { paginate } from '../pagination'

export interface FetchFilters {
  filter?: string
  active?: boolean
}

@Injectable()
export class RegistryTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.registryType.findUnique({
      include: {
        actionLogs: true,
        professionals: true,
      },
      where: {
        id,
      },
    })
  }

  async findByName(name: string) {
    return await this.prisma.registryType.findUnique({
      where: {
        name,
      },
    })
  }

  async fetchPagination({
    page,
    limit = 15,
    order = 'asc',
    active,
    filter,
  }: PaginationParams<Prisma.RegistryTypeOrderByWithAggregationInput> &
    FetchFilters) {
    const where: Prisma.RegistryTypeWhereInput = {}

    if (typeof active === 'boolean') {
      where.isActive = active
    }

    if (filter) {
      where.name = {
        contains: filter,
        mode: 'insensitive',
      }
    }

    const [registryTypes, total] = await Promise.all([
      this.prisma.registryType.findMany({
        where,
        orderBy: {
          name: order,
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.registryType.count({ where }),
    ])

    return paginate<RegistryType>({
      data: registryTypes,
      total,
      page,
      limit,
    })
  }

  async create(
    data: Prisma.RegistryTypeCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.registryType.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.RegistryTypeUpdateInput> & { id: string },
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.registryType.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(registryType: RegistryType) {
    await this.prisma.registryType.delete({
      where: {
        id: registryType.id,
      },
    })
  }
}
