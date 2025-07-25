import { Prisma, User } from '@prisma/client'
import { PrismaService } from '../../prisma.service'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '../users-repository'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    })

    if (!user) return null

    const userWithRelation = await this.prisma.user.findUnique({
      where: { email },
      include: {
        owner:
          user.role === 'OWNER'
            ? {
                omit: {
                  userId: true,
                },
              }
            : false,
        professional: user.role === 'PROFESSIONAL',
      },
    })

    return userWithRelation
  }

  async create(
    data: Prisma.UserCreateInput,
    prisma: Prisma.TransactionClient = this.prisma,
  ) {
    return await prisma.user.create({
      data,
    })
  }
}
