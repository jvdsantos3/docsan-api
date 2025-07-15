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
    limit = 10,
    order = 'desc',
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

    return await this.prisma.documentType.findMany({
      where,
      orderBy: {
        name: order,
      },
      take: limit,
      skip: (page - 1) * limit,
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

  async save(data: DocumentType) {
    return await this.prisma.documentType.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        metadata: data.metadata as Prisma.InputJsonValue,
        createdAt: new Date(),
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
