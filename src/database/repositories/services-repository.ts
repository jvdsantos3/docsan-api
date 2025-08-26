import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { Prisma, Service } from '@prisma/client'
import { PaginationParams } from '../interfaces/pagination-params'
import { paginate } from '../pagination'

export interface ServiceFetchFilters {
  filter?: string
  status?: boolean
  highlight?: boolean
}

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        professionals: true,
      },
    })
  }

  async findByName(name: string) {
    return await this.prisma.service.findUnique({
      where: {
        name,
      },
    })
  }

  async fetchPagination({
    page,
    limit = 15,
    order = 'asc',
    orderBy = 'name',
    status,
    highlight,
    filter,
  }: PaginationParams<Prisma.ServiceOrderByWithAggregationInput> &
    ServiceFetchFilters & {
      orderBy?: 'name' | 'isActive' | 'isHighlighted' | 'status' | 'createdAt'
    }) {
    const where: Prisma.ServiceWhereInput = {}

    if (typeof status === 'boolean') {
      console.log(status)
      where.isActive = status
    }

    if (typeof highlight === 'boolean') {
      where.isHighlighted = highlight
    }

    if (filter) {
      where.OR = [
        {
          name: {
            contains: filter,
            mode: 'insensitive',
          },
        },
        {
          summary: {
            contains: filter,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: filter,
            mode: 'insensitive',
          },
        },
      ]
    }

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        include: {
          professionals: {
            omit: {
              serviceId: true,
              createdAt: true,
              updatedAt: true,
              professionalId: true,
            },
            include: {
              professional: {
                omit: {
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
        where,
        orderBy: {
          [orderBy]: order,
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.service.count({ where }),
    ])

    return paginate<
      Prisma.ServiceGetPayload<{
        include: {
          professionals: {
            omit: {
              serviceId: true
              createdAt: true
              updatedAt: true
              professionalId: true
            }
            include: {
              professional: {
                omit: {
                  createdAt: true
                  updatedAt: true
                }
              }
            }
          }
        }
      }>
    >({
      data: services,
      total,
      page,
      limit,
    })
  }

  async create(
    data: Prisma.ServiceCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Service> {
    const prisma = tx || this.prisma

    const service = await prisma.service.create({
      data,
    })

    return service
  }

  async save(
    data: Partial<Prisma.ServiceUncheckedUpdateInput> & { id: string },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.service.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
