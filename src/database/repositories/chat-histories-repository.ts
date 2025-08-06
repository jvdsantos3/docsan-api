import { Injectable } from '@nestjs/common'
import { ChatHistory, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class ChatHistoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<ChatHistory | null> {
    return await this.prisma.chatHistory.findUnique({
      where: {
        id,
      },
    })
  }

  async create(
    data: Prisma.ChatHistoryUncheckedCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ): Promise<ChatHistory> {
    return await prisma.chatHistory.create({
      data,
    })
  }
}
