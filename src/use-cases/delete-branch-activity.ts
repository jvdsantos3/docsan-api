import { Injectable } from '@nestjs/common'
import { BranchActivityNotFoundError } from './errors/branch-activity-not-found-error'
import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'

interface DeleteBranchActivityUseCaseRequest {
  branchActivityId: string
}

@Injectable()
export class DeleteBranchActivityUseCase {
  constructor(private branchesActivityRepository: BranchesActivityRepository) {}

  async execute({
    branchActivityId,
  }: DeleteBranchActivityUseCaseRequest): Promise<void> {
    const branchActivity =
      await this.branchesActivityRepository.findById(branchActivityId)

    if (!branchActivity) {
      throw new BranchActivityNotFoundError()
    }

    await this.branchesActivityRepository.delete(branchActivity)
  }
}
