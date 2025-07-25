import { Prisma, User } from '@prisma/client'

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract create(
    data: Prisma.UserCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<User>
}
