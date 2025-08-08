import { Injectable } from '@nestjs/common'
import { BranchActivity } from '@prisma/client'
import { BranchActivityNotFoundError } from './errors/branch-activity-not-found-error'
import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'

interface ChangeBranchActivityUseCaseRequest {
  branchActivityId: string
}

interface ChangeBranchActivityUseCaseResponse {
  branchActivity: BranchActivity
}

@Injectable()
export class ChangeBranchActivityActiveUseCase {
  constructor(private branchesActivityRepository: BranchesActivityRepository) {}

  async execute({
    branchActivityId,
  }: ChangeBranchActivityUseCaseRequest): Promise<ChangeBranchActivityUseCaseResponse> {
    const branchActivity =
      await this.branchesActivityRepository.findById(branchActivityId)

    if (!branchActivity) {
      throw new BranchActivityNotFoundError()
    }

    const newBranchActivity = await this.branchesActivityRepository.save({
      id: branchActivity.id,
      isActive: !branchActivity.isActive,
    })

    return {
      branchActivity: newBranchActivity,
    }
  }
}
