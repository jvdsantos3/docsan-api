import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'
import { PaginationResponse } from '../database/interfaces/pagination-params'
import { Injectable } from '@nestjs/common'
import { BranchActivity } from '@prisma/client'

interface FetchBranchesActivityUseCaseRequest {
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  active?: boolean
  filter?: string
}

interface FetchBranchesActivityUseCaseResponse {
  branchesActivity: PaginationResponse<BranchActivity>
}

@Injectable()
export class FetchBranchesActivityUseCase {
  constructor(private branchesActivityRepository: BranchesActivityRepository) {}

  async execute({
    page,
    limit,
    order,
    active,
    filter,
  }: FetchBranchesActivityUseCaseRequest): Promise<FetchBranchesActivityUseCaseResponse> {
    const branchesActivity = await this.branchesActivityRepository.fetchPagination({
      page,
      limit,
      order,
      active,
      filter,
    })

    return {
      branchesActivity,
    }
  }
}
