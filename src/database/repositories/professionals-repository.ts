import { Prisma, Professional } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '../interfaces/pagination-params'
import { paginate } from '../pagination'

export interface FindManyFilters {
  status?: 'APPROVED' | 'REJECTED' | 'PENDING' | 'BANNED'
  filter?: string
}

@Injectable()
export class ProfessionalsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Professional | null> {
    return await this.prisma.professional.findUnique({
      include: {
        address: {
          omit: {
            id: true,
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

  async findByCpf(cpf: string): Promise<Professional | null> {
    return await this.prisma.professional.findUnique({
      where: {
        cpf,
      },
    })
  }

  async findByCnpj(cnpj: string): Promise<Professional | null> {
    return await this.prisma.professional.findUnique({
      where: {
        cnpj,
      },
    })
  }

  async fetchPagination({
    page,
    limit,
    order = 'desc',
    orderBy = 'createdAt',
    status,
    filter,
  }: PaginationParams<'name' | 'cpf' | 'status' | 'email' | 'createdAt'> &
    FindManyFilters) {
    const where: Prisma.ProfessionalWhereInput = {}

    if (status) {
      where.status = status
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
          cpf: {
            contains: filter,
            mode: 'insensitive',
          },
        },
        {
          user: {
            email: {
              contains: filter,
              mode: 'insensitive',
            },
          },
        },
      ]
    }

    const [professionals, total] = await Promise.all([
      this.prisma.professional.findMany({
        where,
        orderBy: {
          [orderBy]: order,
        },
        skip: (page - 1) * (limit ?? 15),
        take: limit ?? 15,
        include: {
          user: {
            omit: {
              password: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.professional.count({
        where,
      }),
    ])

    return paginate<
      Prisma.ProfessionalGetPayload<{
        include: {
          user: {
            omit: {
              password: true
              role: true
            }
          }
        }
      }>
    >({
      data: professionals,
      total,
      page,
      limit,
    })
  }

  async create(
    data: Prisma.ProfessionalUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.professional.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.ProfessionalUncheckedCreateInput> & { id: string },
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.professional.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
