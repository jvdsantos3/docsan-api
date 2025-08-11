import { Injectable } from '@nestjs/common'
import { Cnae, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '../interfaces/pagination-params'
import { paginate } from '../pagination'

export interface FetchFilters {
  filter?: string
  active?: boolean
}

@Injectable()
export class CnaesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.cnae.findUnique({
      include: {
        actionLogs: true,
        professionals: true,
      },
      where: {
        id,
      },
    })
  }

  async findByCode(code: string) {
    return await this.prisma.cnae.findUnique({
      where: {
        code,
      },
    })
  }

  async fetchPagination({
    page,
    limit = 15,
    order = 'asc',
    active,
    filter,
  }: PaginationParams<Prisma.CnaeOrderByWithAggregationInput> & FetchFilters) {
    const where: Prisma.CnaeWhereInput = {}

    if (typeof active === 'boolean') {
      where.isActive = active
    }

    if (filter) {
      where.OR = [
        {
          description: {
            contains: filter,
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: filter,
            mode: 'insensitive',
          },
        },
      ]
    }

    const [cnaes, total] = await Promise.all([
      this.prisma.cnae.findMany({
        where,
        orderBy: {
          code: order,
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.cnae.count({ where }),
    ])

    return paginate<Cnae>({
      data: cnaes,
      total,
      page,
      limit,
    })
  }

  async create(
    data: Prisma.CnaeCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.cnae.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.CnaeUpdateInput> & { id: string },
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.cnae.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(cnae: Cnae) {
    await this.prisma.cnae.delete({
      where: {
        id: cnae.id,
      },
    })
  }
}
