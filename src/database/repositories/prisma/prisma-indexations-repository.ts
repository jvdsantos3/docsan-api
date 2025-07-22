import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'
import { IndexationsRepository } from '../indexations-repository'

@Injectable()
export class PrismaIndexationsRepository implements IndexationsRepository {
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
