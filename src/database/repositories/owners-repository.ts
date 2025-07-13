import { Owner, Prisma } from '@prisma/client'

export abstract class OwnersRepository {
  abstract findById(id: string): Promise<Owner | null>
  abstract findByEmail(email: string): Promise<Owner | null>
  abstract create(
    data: Prisma.OwnerCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Owner>
}
