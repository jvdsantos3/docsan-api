import { Injectable } from '@nestjs/common'
import { Owner, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class OwnersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Owner | null> {
    return await this.prisma.owner.findUnique({
      where: {
        id,
      },
    })
  }

  async findByIdWithCompany(id: string): Promise<Owner | null> {
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

  async findByCpf(cpf: string): Promise<Owner | null> {
    return await this.prisma.owner.findUnique({
      where: {
        cpf,
      },
    })
  }

  async create(
    data: Prisma.OwnerUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<Owner> {
    return await prisma.owner.create({
      data,
    })
  }
}
