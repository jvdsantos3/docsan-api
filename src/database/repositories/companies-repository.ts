import { Injectable } from '@nestjs/common'
import { Company, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class CompaniesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Company | null> {
    return await this.prisma.company.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.CompanyUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<Company> {
    return await prisma.company.create({
      data,
    })
  }
}
