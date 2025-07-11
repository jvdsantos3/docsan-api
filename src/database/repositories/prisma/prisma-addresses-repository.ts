import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { Prisma } from '@prisma/client'
import { AddressesRepository } from '../address-repository'

@Injectable()
export class PrismaAddressesRepository implements AddressesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.address.findUnique({
      where: {
        id,
      },
    })
  }

  async create(data: Prisma.AddressCreateInput) {
    return await this.prisma.address.create({
      data,
    })
  }
}
