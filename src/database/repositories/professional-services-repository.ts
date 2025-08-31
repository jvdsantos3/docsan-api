import { Injectable } from '@nestjs/common'
import { Prisma, ProfessionalService } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { paginate } from '../pagination'
import { PaginationParams } from '../interfaces/pagination-params'

export interface FetchFilters {
  professionalId?: string
  serviceId?: string
  filter?: string
}

@Injectable()
export class ProfessionalServicesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.professionalService.findUnique({
      include: {
        professional: {
          omit: {
            createdAt: true,
            updatedAt: true,
            userId: true,
            addressId: true,
            branchActivityId: true,
            cnaeId: true,
            registryTypeId: true,
          },
        },
        service: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where: {
        id,
      },
    })
  }

  async findByProfessionalAndService(
    professionalId: string,
    serviceId: string,
  ) {
    return await this.prisma.professionalService.findUnique({
      where: {
        professionalId_serviceId: {
          professionalId,
          serviceId,
        },
      },
    })
  }

  async findManyByProfessional(
    professionalId: string,
    {
      page,
      limit = 15,
    }: PaginationParams<Prisma.ProfessionalServiceOrderByWithAggregationInput>,
    filters?: FetchFilters,
  ) {
    const where: Prisma.ProfessionalServiceWhereInput = {
      professionalId,
    }

    if (filters?.serviceId) {
      where.serviceId = filters.serviceId
    }

    if (filters?.filter) {
      where.service = {
        name: {
          contains: filters.filter,
          mode: 'insensitive',
        },
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.professionalService.findMany({
        include: {
          service: {
            omit: {
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.professionalService.count({ where }),
    ])

    return paginate({
      data,
      total,
      page,
      limit,
    })
  }

  async findManyByService(
    serviceId: string,
    {
      page,
      limit = 15,
    }: PaginationParams<Prisma.ProfessionalServiceOrderByWithAggregationInput>,
    filters?: FetchFilters,
  ) {
    const where: Prisma.ProfessionalServiceWhereInput = {
      serviceId,
    }

    if (filters?.professionalId) {
      where.professionalId = filters.professionalId
    }

    if (filters?.filter) {
      where.professional = {
        name: {
          contains: filters.filter,
          mode: 'insensitive',
        },
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.professionalService.findMany({
        include: {
          professional: {
            omit: {
              createdAt: true,
              updatedAt: true,
              userId: true,
              addressId: true,
              branchActivityId: true,
              cnaeId: true,
              registryTypeId: true,
            },
          },
        },
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.professionalService.count({ where }),
    ])

    return paginate({
      data,
      total,
      page,
      limit,
    })
  }

  async create(
    data: Prisma.ProfessionalServiceUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<ProfessionalService> {
    const prisma = tx || this.prisma

    return await prisma.professionalService.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.ProfessionalServiceUncheckedUpdateInput> & {
      id: string
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.professionalService.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prisma

    return await prisma.professionalService.delete({
      where: {
        id,
      },
    })
  }

  async deleteByProfessionalAndService(
    professionalId: string,
    serviceId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.professionalService.delete({
      where: {
        professionalId_serviceId: {
          professionalId,
          serviceId,
        },
      },
    })
  }
}
