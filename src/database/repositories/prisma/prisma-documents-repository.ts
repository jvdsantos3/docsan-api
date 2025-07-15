import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'
import { DocumentsRepository } from '../documents-repository'

@Injectable()
export class PrismaDocumentsRepository implements DocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.document.findUnique({
      where: {
        id,
      },
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
}
