import { Injectable } from '@nestjs/common'
import { DocumentType, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '../interfaces/pagination-params'
import { paginate } from '../pagination'

export interface FetchFilters {
  filter?: string
  active?: boolean
}

@Injectable()
export class DocumentTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.documentType.findUnique({
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
        actionLogs: {
          include: {
            user: {
              omit: {
                password: true,
              },
              include: {
                owner: {
                  omit: {
                    companyId: true,
                    userId: true,
                  },
                },
                professional: {
                  omit: {
                    userId: true,
                  },
                },
              },
            },
          },
          omit: {
            documentId: true,
            documentTypeId: true,
            companyId: true,
          },
        },
      },
      where: {
        id,
      },
    })
  }

  async findByIdWithDocuments(id: string) {
    return await this.prisma.documentType.findUnique({
      include: {
        documents: true,
      },
      where: {
        id,
      },
    })
  }

  async findByName(name: string, companyId: string) {
    return await this.prisma.documentType.findUnique({
      where: {
        name_companyId: {
          name,
          companyId,
        },
      },
    })
  }

  async fetchPagination({
    page,
    limit = 15,
    order = 'asc',
    active,
    filter,
  }: PaginationParams<Prisma.DocumentTypeOrderByRelationAggregateInput> &
    FetchFilters) {
    const where: Prisma.DocumentTypeWhereInput = {}

    if (typeof active === 'boolean') {
      where.isActive = active
    }

    if (filter) {
      where.name = {
        contains: filter,
        mode: 'insensitive',
      }
    }

    const [documentTypes, total] = await Promise.all([
      this.prisma.documentType.findMany({
        where,
        orderBy: {
          name: order,
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          _count: {
            select: {
              documents: true,
            },
          },
        },
      }),
      this.prisma.documentType.count({ where }),
    ])

    return paginate<DocumentType>({
      data: documentTypes,
      total,
      page,
      limit,
    })
  }

  async create(
    data: Prisma.DocumentTypeUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.documentType.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.DocumentTypeUncheckedUpdateInput> & { id: string },
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.documentType.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(documentType: DocumentType) {
    await this.prisma.documentType.delete({
      where: {
        id: documentType.id,
      },
    })
  }
}
