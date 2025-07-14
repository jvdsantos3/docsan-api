import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'
import { DocumentTypesRepository } from '../document-types-repository'
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

  async findByName(name: string) {
    return await this.prisma.documentType.findUnique({
      where: {
        name,
      },
    })
  }

  async findMany({ page, limit = 10, order = 'desc' }: PaginationParams) {
    return await this.prisma.documentType.findMany({
      orderBy: {
        createdAt: order,
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
}
