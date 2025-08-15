import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PasswordResetTokensRepository {
  constructor(private prisma: PrismaService) {}

  async findUnusedByToken(token: string) {
    return await this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
      },
    })
  }

  async findUnusedByUserId(userId: string) {
    return await this.prisma.passwordResetToken.findFirst({
      where: {
        userId,
        used: false,
      },
    })
  }

  async create(
    data: Prisma.PasswordResetTokenUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.passwordResetToken.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.PasswordResetTokenUncheckedUpdateInput> & {
      id: string
    },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.passwordResetToken.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
