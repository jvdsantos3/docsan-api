import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { PaginationParams } from '../interfaces/pagination-params'
import { getDocumentStatusUnformated } from '@/use-cases/get-document-status'
import { paginate } from '../pagination'

export interface FindManyFilters {
  documentTypeId?: string
  companyId?: string
  status?: 'inDay' | 'near' | 'won'
  type?: string
  filter?: string
}

@Injectable()
export class DocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, companyId?: string) {
    const where: Prisma.DocumentWhereUniqueInput = {
      id,
    }

    if (companyId) where.companyId = companyId

    return await this.prisma.document.findUnique({
      include: {
        documentType: true,
        indexation: true,
        actionLog: {
          include: {
            user: {
              include: {
                owner: true,
                professional: true,
              },
            },
          },
        },
      },
      where,
    })
  }

  async findFirstByDocumentId(id: string) {
    return await this.prisma.document.findFirst({
      where: { documentTypeId: id },
      orderBy: { version: 'desc' },
    })
  }

  async findManyByDocumentId(id: string) {
    return await this.prisma.document.findMany({
      include: {
        documentType: true,
      },
      where: { documentTypeId: id },
      orderBy: { version: 'desc' },
    })
  }

  async findMany(companyId?: string) {
    const where: Prisma.DocumentWhereInput = {
      isLatest: true,
    }

    if (companyId) where.companyId = companyId

    return await this.prisma.document.findMany({
      include: {
        documentType: true,
        indexation: true,
      },
      where,
      orderBy: { version: 'desc' },
    })
  }

  async fetchByDocumentTypeId(id: string) {
    return await this.prisma.document.findMany({
      where: {
        documentTypeId: id,
      },
      orderBy: { version: 'desc' },
    })
  }

  async fetchPagination({
    companyId,
    page,
    limit = 15,
    order = 'desc',
    orderBy = 'createdAt',
    type,
    status,
    filter,
  }: PaginationParams<'name' | 'type' | 'status' | 'duedate' | 'createdAt'> &
    FindManyFilters) {
    const where: Prisma.DocumentWhereInput = {
      companyId,
      isLatest: true,
    }

    if (type) {
      where.documentType = {
        id: type,
      }
    }

    if (filter) {
      where.name = {
        contains: filter,
        mode: 'insensitive',
      }
    }

    const requiresStatusSorting = orderBy === 'status'

    const documentsBase = await this.prisma.document.findMany({
      where,
      include: {
        documentType: true,
      },
      ...(requiresStatusSorting
        ? {}
        : { orderBy: this.getOrderByField(orderBy, order) }),
    })

    const documentsWithStatus = documentsBase.map((doc) => {
      const status = getDocumentStatusUnformated(
        doc.duedate,
        doc.documentType.validityPeriod,
      )
      return { ...doc, status }
    })

    const filteredByStatus = status
      ? documentsWithStatus.filter((doc) => doc.status === status)
      : documentsWithStatus

    const finalSorted = requiresStatusSorting
      ? filteredByStatus.sort((a, b) => {
          const weights = { inDay: 1, near: 2, won: 3 }
          return order === 'asc'
            ? weights[a.status] - weights[b.status]
            : weights[b.status] - weights[a.status]
        })
      : filteredByStatus

    const total = finalSorted.length

    const paginatedData = finalSorted.slice((page - 1) * limit, page * limit)

    return paginate<
      Prisma.DocumentGetPayload<{
        include: {
          documentType: true
        }
      }> & {
        status: 'inDay' | 'near' | 'won'
      }
    >({
      data: paginatedData,
      total,
      page,
      limit,
    })
  }

  async fetchByDocumentTypeIdPagination({
    documentTypeId,
    page,
    limit = 15,
    order = 'desc',
    orderBy = 'createdAt',
    filter,
  }: PaginationParams<'name' | 'createdAt'> & FindManyFilters) {
    const where: Prisma.DocumentWhereInput = {
      documentTypeId,
    }

    if (filter) {
      where.name = {
        contains: filter,
        mode: 'insensitive',
      }
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        include: {
          documentType: true,
        },
        where,
        orderBy: {
          [orderBy]: order,
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.document.count({ where }),
    ])

    const documentsWithStatus = documents.map((doc) => {
      const status = getDocumentStatusUnformated(
        doc.duedate,
        doc.documentType.validityPeriod,
      )

      return {
        ...doc,
        status,
      }
    })

    return paginate<
      Prisma.DocumentGetPayload<{
        include: {
          documentType: true
        }
      }> & {
        status: 'inDay' | 'near' | 'won'
      }
    >({
      data: documentsWithStatus,
      total,
      page,
      limit,
    })
  }

  async save(
    data: Partial<Prisma.DocumentUncheckedUpdateInput> & { id: string },
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.document.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(
    data: Prisma.DocumentUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.document.create({
      data,
    })
  }

  private getOrderByField(orderBy: string, order: 'asc' | 'desc') {
    if (orderBy === 'type') {
      return {
        documentType: {
          name: order,
        },
      }
    }

    return {
      [orderBy]: order,
    }
  }
}
