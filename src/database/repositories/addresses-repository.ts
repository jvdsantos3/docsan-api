import { Address, Prisma } from '@prisma/client'

export abstract class AddressesRepository {
  abstract findById(id: string): Promise<Address | null>
  abstract create(
    data: Prisma.AddressCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Address>
}
