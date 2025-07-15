import { Document, Prisma } from '@prisma/client'

export abstract class DocumentsRepository {
  abstract findById(id: string): Promise<Document | null>
  abstract create(
    data: Prisma.DocumentUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Document>
}
