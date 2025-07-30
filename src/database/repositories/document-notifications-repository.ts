import { Injectable } from '@nestjs/common'
import { DocumentNotification, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class DocumentNotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<DocumentNotification | null> {
    return await this.prisma.documentNotification.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.DocumentNotificationUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<DocumentNotification> {
    return await prisma.documentNotification.create({
      data,
    })
  }
}
