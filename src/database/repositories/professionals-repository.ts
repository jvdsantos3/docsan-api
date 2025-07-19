import { Professional, Prisma } from '@prisma/client'

export abstract class ProfessionalsRepository {
  abstract findById(id: string): Promise<Professional | null>
  abstract findByEmail(email: string): Promise<Professional | null>
  abstract findByCpf(cpf: string): Promise<Professional | null>
  abstract create(
    data: Prisma.ProfessionalUncheckedCreateInput,
    prisma?: Prisma.TransactionClient,
  ): Promise<Professional>
}
