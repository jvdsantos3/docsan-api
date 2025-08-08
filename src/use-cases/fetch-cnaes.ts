import { PaginationResponse } from '../database/interfaces/pagination-params'
import { CnaesRepository } from '@/database/repositories/cnaes-repository'
import { Injectable } from '@nestjs/common'
import { Cnae } from '@prisma/client'

interface FetchCnaesUseCaseRequest {
  page: number
  limit?: number
  order?: 'desc' | 'asc',
  active?: boolean
  filter?: string
}

interface FetchCnaesUseCaseResponse {
  cnaes: PaginationResponse<Cnae>
}

@Injectable()
export class FetchCnaesUseCase {
  constructor(private cnaesRepository: CnaesRepository) {}

  async execute({
    page,
    limit,
    order,
    active,
    filter,
  }: FetchCnaesUseCaseRequest): Promise<FetchCnaesUseCaseResponse> {
    const cnaes = await this.cnaesRepository.fetchPagination({
      page,
      limit,
      order,
      active,
      filter,
    })

    return {
      cnaes,
    }
  }
}
