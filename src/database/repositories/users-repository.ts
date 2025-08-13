import { Prisma, User } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

export type UserWithProfile = Prisma.UserGetPayload<{
  include: {
    owner: {
      omit: {
        userId: true
      }
      include: {
        company: {
          include: {
            address: {
              omit: {
                createdAt: true
                updatedAt: true
              }
            }
          }
        }
      }
    }
    professional: {
      omit: {
        userId: true
      }
      include: {
        address: {
          omit: {
            createdAt: true
            updatedAt: true
          }
        }
        companies: {
          omit: {
            professionalId: true
          }
        }
      }
    }
  }
}>

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserWithProfile | null> {
    const user = await this.prisma.user.findUnique({
      include: {
        owner: {
          omit: {
            userId: true,
          },
          include: {
            company: {
              include: {
                address: {
                  omit: {
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        },
        professional: {
          omit: {
            userId: true,
          },
          include: {
            address: {
              omit: {
                createdAt: true,
                updatedAt: true,
              },
            },
            companies: {
              omit: {
                professionalId: true,
              },
            },
          },
        },
      },
      where: { id },
    })

    return user
  }

  async findByEmail(email: string): Promise<Prisma.UserGetPayload<{
    include: {
      professional: true
    }
  }> | null> {
    const user = await this.prisma.user.findUnique({
      include: {
        professional: true,
        owner: true,
        admin: true,
      },
      where: { email },
    })

    return user
  }

  async create(
    data: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const prisma = tx || this.prisma

    return await prisma.user.create({
      data,
    })
  }

  async save(
    data: Partial<Prisma.UserUpdateInput> & { id: string },
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma

    return await prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
