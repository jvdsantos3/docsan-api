import { Injectable } from '@nestjs/common'
import { Address, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class AddressesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Address | null> {
    return await this.prisma.address.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.AddressCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<Address> {
    return await prisma.address.create({
      data,
    })
  }
}
