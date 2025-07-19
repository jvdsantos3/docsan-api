import { Prisma, Professional } from '@prisma/client'
import { PrismaService } from '../../prisma.service'
import { Injectable } from '@nestjs/common'
import { ProfessionalsRepository } from '../professionals-repository'

@Injectable()
export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Professional | null> {
    return await this.prisma.professional.findUnique({
      where: {
        id,
      },
    })
  }

  async findByEmail(email: string): Promise<Professional | null> {
    return await this.prisma.professional.findUnique({
      where: {
        email,
      },
    })
  }

  async findByCpf(cpf: string): Promise<Professional | null> {
    return await this.prisma.professional.findUnique({
      where: {
        cpf,
      },
    })
  }

  async create(
    data: Prisma.ProfessionalUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.professional.create({
      data,
    })
  }
}
