import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'
import { DocumentsRepository, FindManyFilters } from '../documents-repository'
import { PaginationParams } from '../interfaces/pagination-params'
import { paginate } from '../pagination'
import { addDays, isBefore, parse } from 'date-fns'

@Injectable()
export class PrismaDocumentsRepository implements DocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, companyId?: string) {
    const where: Prisma.DocumentWhereUniqueInput = {
      id,
    }

    if (companyId) where.companyId = companyId

    return await this.prisma.document.findUnique({
      where,
    })
  }

  async findByIdWithComputed(id: string, companyId: string) {
    const where: Prisma.DocumentWhereUniqueInput = {
      id,
    }

    if (companyId) where.companyId = companyId

    return await this.prisma.document.findUnique({
      include: {
        documentType: true,
        indexation: true,
        actionLog: true,
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

  async fetch(companyId: string) {
    const where: Prisma.DocumentWhereInput = {}

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

  // TODO
  async findMany({
    companyId,
    page,
    limit = 15,
    order = 'asc',
    orderBy = 'name',
    type,
    status,
    filter,
  }: PaginationParams & FindManyFilters) {
    const where: any = {}

    if (companyId) {
      where.companyId = companyId
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

    let orderByFields: any

    if (orderBy === 'type') {
      orderByFields = {
        documentType: {
          name: order,
        },
      }
    } else if (orderBy === 'status' || orderBy === 'duedate') {
      orderByFields = undefined
    } else {
      orderByFields = {
        [orderBy]: order,
      }
    }

    let documents = await this.prisma.document.findMany({
      include: {
        indexation: {
          omit: {
            documentId: true,
          },
        },
        documentType: {
          omit: {
            companyId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where,
      orderBy: orderByFields,
      take: limit,
      skip: (page - 1) * limit,
    })

    documents = documents.map((doc) => {
      const indexationValues = doc.indexation?.values as Prisma.JsonArray

      const dueDateEntry = indexationValues.find(
        (value): value is { name: string; value: any } =>
          typeof value === 'object' &&
          value !== null &&
          'name' in value &&
          'value' in value &&
          (value as any).name === 'Data de vencimento',
      )

      const dueDate = dueDateEntry ? dueDateEntry.value : null
      const status = dueDate ? this.calculateStatus(dueDate) : 'inDay'

      return { ...doc, dueDate, status }
    })

    if (status) {
      documents = documents.filter((doc: any) => doc.status === status)
    }

    if (orderBy === 'status' || orderBy === 'duedate') {
      const statusOrder = ['inDay', 'near', 'won']

      documents = documents.sort((a: any, b: any) => {
        if (orderBy === 'status') {
          const aIndex = statusOrder.indexOf(a.status)
          const bIndex = statusOrder.indexOf(b.status)
          return order === 'asc' ? aIndex - bIndex : bIndex - aIndex
        } else if (orderBy === 'duedate') {
          const aDate = a.duedate
            ? parse(a.duedate, 'dd/MM/yyyy', new Date())
            : new Date(0)

          const bDate = b.duedate
            ? parse(b.duedate, 'dd/MM/yyyy', new Date())
            : new Date(0)

          return order === 'asc'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime()
        }
        return 0
      })
    }

    return paginate({
      data: documents,
      total: documents.length,
      page,
      limit,
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

  calculateStatus(dueDateStr: string): 'inDay' | 'near' | 'won' {
    const today = new Date()
    const dueDate = parse(dueDateStr, 'dd/MM/yyyy', new Date())
    const ninetyDaysFromNow = addDays(today, 90)

    if (isBefore(dueDate, today)) {
      return 'won'
    } else if (
      isBefore(dueDate, ninetyDaysFromNow) ||
      dueDate.getTime() === today.getTime()
    ) {
      return 'near'
    } else {
      return 'inDay'
    }
  }
}
