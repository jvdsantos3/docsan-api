import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ProfessionalStatusHistoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: Prisma.ProfessionalStatusHistoryUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.professionalStatusHistory.create({
      data,
    })
  }
}
