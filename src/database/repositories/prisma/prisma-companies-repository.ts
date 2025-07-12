import { CompaniesRepository } from './../companies-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.company.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.CompanyUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.company.create({
      data,
    })
  }
}
