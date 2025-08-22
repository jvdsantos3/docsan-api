import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { Prisma, Service } from '@prisma/client'

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.service.findUnique({
      where: {
        id,
      },
      include: {
        professionals: true,
      },
    })
  }

  async findByName(name: string) {
    return await this.prisma.service.findUnique({
      where: {
        name,
      },
    })
  }

  async fetchPaginate() {
    const services = this.prisma.service.findMany({})

    return services
  }

  async create(
    data: Prisma.ServiceCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Service> {
    const prisma = tx || this.prisma

    const service = await prisma.service.create({
      data,
    })

    return service
  }

  async save(
    data: Partial<Prisma.ServiceUncheckedUpdateInput> & { id: string },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.service.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
