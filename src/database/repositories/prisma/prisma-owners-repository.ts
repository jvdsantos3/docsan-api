import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'
import { OwnersRepository } from '../owners-repository'

@Injectable()
export class PrismaOwnersRepository implements OwnersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.owner.findUnique({
      where: {
        email,
      },
    })
  }

  async findById(id: string) {
    return await this.prisma.owner.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.OwnerCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.owner.create({
      data,
    })
  }
}
