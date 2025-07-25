import { Prisma, Professional } from '@prisma/client'
import { PrismaService } from '../../prisma.service'
import { Injectable } from '@nestjs/common'
import { ProfessionalsRepository } from '../professionals-repository'

@Injectable()
export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Professional | null> {
    return await this.prisma.professional.findUnique({
      include: {
        address: {
          omit: {
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      where: {
        id,
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
