import { Indexation, Prisma } from '@prisma/client'

export abstract class IndexationsRepository {
  abstract findById(id: string): Promise<Indexation | null>
  abstract create(
    data: Prisma.IndexationUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Indexation>
}
