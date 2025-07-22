import { Document, Prisma } from '@prisma/client'

export abstract class DocumentsRepository {
  abstract findById(id: string): Promise<Document | null>
  abstract findFirstByDocumentId(id: string): Promise<Document | null>
  abstract fetchByDocumentTypeId(id: string): Promise<Document[]>
  abstract create(
    data: Prisma.DocumentUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Document>
}
