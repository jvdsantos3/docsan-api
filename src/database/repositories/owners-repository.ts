import { Company, Owner, Prisma } from '@prisma/client'

export abstract class OwnersRepository {
  abstract findById(id: string): Promise<Owner | null>
  abstract findByIdWithCompany(
    id: string,
  ): Promise<(Owner & { company: Company | null }) | null>
  abstract findByEmail(email: string): Promise<Owner | null>
  abstract create(
    data: Prisma.OwnerUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Owner>
}
