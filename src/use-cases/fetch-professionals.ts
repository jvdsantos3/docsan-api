import { PaginationResponse } from '@/database/interfaces/pagination-params'
import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

interface FetchProfessionalsUseCaseRequest {
  page: number
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: 'name' | 'cpf' | 'status' | 'email' | 'createdAt'
  status?: 'APPROVED' | 'REJECTED' | 'PENDING' | 'BANNED'
  filter?: string
}

interface FetchProfessionalsUseCaseResponse {
  professionals: PaginationResponse<
    Prisma.ProfessionalGetPayload<{
      include: {
        user: {
          omit: {
            password: true
            role: true
          }
        }
      }
    }>
  >
}

@Injectable()
export class FetchProfessionalsUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    page,
    limit,
    order,
    orderBy,
    status,
    filter,
  }: FetchProfessionalsUseCaseRequest): Promise<FetchProfessionalsUseCaseResponse> {
    const professionals = await this.professionalsRepository.fetchPagination({
      page,
      limit,
      order,
      orderBy,
      status,
      filter,
    })

    return {
      professionals,
    }
  }
}
