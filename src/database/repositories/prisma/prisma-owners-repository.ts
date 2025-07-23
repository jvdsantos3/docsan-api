import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'
import { OwnersRepository } from '../owners-repository'

@Injectable()
export class PrismaOwnersRepository implements OwnersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.owner.findUnique({
      where: {
        id,
      },
    })
  }

  async findByIdWithCompany(id: string) {
    return await this.prisma.owner.findUnique({
      include: {
        company: {
          include: {
            address: {
              omit: {
                id: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      where: {
        id,
      },
    })
  }

  async findByEmail(email: string) {
    return await this.prisma.owner.findUnique({
      where: {
        email,
      },
    })
  }

  async findByCpf(cpf: string) {
    return await this.prisma.owner.findUnique({
      where: {
        cpf,
      },
    })
  }

  async create(
    data: Prisma.OwnerUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.owner.create({
      data,
    })
  }
}
