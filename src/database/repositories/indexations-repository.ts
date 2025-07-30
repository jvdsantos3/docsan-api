import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class IndexationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.indexation.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.IndexationUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.indexation.create({
      data,
    })
  }
}
