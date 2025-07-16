import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { DocumentType, Prisma } from '@prisma/client'
import {
  DocumentTypesRepository,
  FindManyFilters,
} from '../document-types-repository'
import { PaginationParams } from '../interfaces/pagination-params'

@Injectable()
export class PrismaDocumentTypesRepository implements DocumentTypesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.documentType.findUnique({
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

  async findByName(name: string) {
    return await this.prisma.documentType.findUnique({
      where: {
        name,
      },
    })
  }

  async findMany({
    page,
    limit = 15,
    order = 'asc',
    active,
    filter,
  }: PaginationParams & FindManyFilters) {
    const where: any = {}

    if (typeof active === 'boolean') {
      where.active = active
    }

    if (filter) {
      where.name = {
        contains: filter,
        mode: 'insensitive',
      }
    }

    const total = await this.prisma.documentType.count({ where })
    const current = page
    const first = total > 0 ? 1 : null
    const last = Math.ceil(total / limit)
    const next = page < last ? page + 1 : null
    const prev = page > 1 ? page - 1 : null

    const documentTypes = await this.prisma.documentType.findMany({
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
    })

    return {
      data: documentTypes,
      first,
      last,
      current,
      next,
      prev,
      total,
    }
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
    data: DocumentType,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.documentType.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        metadata: data.metadata as Prisma.InputJsonValue,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
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
