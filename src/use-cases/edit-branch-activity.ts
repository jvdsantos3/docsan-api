import { Injectable } from '@nestjs/common'
import { BranchActivity } from '@prisma/client'
import { UserPayload } from '@/auth/jwt.strategy'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'
import { BranchActivityAlreadyExistsError } from './errors/branch-activity-already-exists-error'
import { BranchActivityNotFoundError } from './errors/branch-activity-not-found-error'
import { BranchActivityEvent } from '@/events/branch-activity.event'

interface EditBranchActivityUseCaseRequest {
  user: UserPayload
  branchActivityId: string
  name: string
}

interface EditBranchActivityUseCaseResponse {
  branchActivity: BranchActivity
}

@Injectable()
export class EditBranchActivityUseCase {
  constructor(
    private branchesActivityRepository: BranchesActivityRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    branchActivityId,
    name
  }: EditBranchActivityUseCaseRequest): Promise<EditBranchActivityUseCaseResponse> {
    const currentBranchActivity =
      await this.branchesActivityRepository.findById(branchActivityId)

    if (!currentBranchActivity) {
      throw new BranchActivityNotFoundError()
    }

    const branchActivityWithSameName =
      await this.branchesActivityRepository.findByName(name)

    if (branchActivityWithSameName && currentBranchActivity.name !== name) {
      throw new BranchActivityAlreadyExistsError(name)
    }

    const newBranchActivity = await this.branchesActivityRepository.save({
      id: branchActivityId,
      name
    })

    this.eventEmitter.emit(
      'branch-activity.updated',
      new BranchActivityEvent(newBranchActivity.id, user.sub),
    )

    return {
      branchActivity: newBranchActivity,
    }
  }
}
