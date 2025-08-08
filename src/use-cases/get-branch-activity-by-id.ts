import { Injectable } from '@nestjs/common'
import { BranchActivity } from '@prisma/client'
import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'
import { BranchActivityNotFoundError } from './errors/branch-activity-not-found-error'

interface GetBranchActivitByIdUseCaseRequest {
  branchActivityId: string
}

interface GetBranchActivitByIdUseCaseResponse {
  branchActivity: BranchActivity
}

@Injectable()
export class GetBranchActivitByIdUseCase {
  constructor(private branchesActivityRepository: BranchesActivityRepository) {}

  async execute({
    branchActivityId,
  }: GetBranchActivitByIdUseCaseRequest): Promise<GetBranchActivitByIdUseCaseResponse> {
    const branchActivity =
      await this.branchesActivityRepository.findById(branchActivityId)

    if (!branchActivity) {
      throw new BranchActivityNotFoundError()
    }

    return {
      branchActivity,
    }
  }
}
