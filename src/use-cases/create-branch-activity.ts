import { Injectable } from '@nestjs/common'
import { BranchActivity } from '@prisma/client'
import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'
import { BranchActivityAlreadyExistsError } from './errors/branch-activity-already-exists-error'
// import { EventEmitter2 } from '@nestjs/event-emitter'
// import { UserPayload } from '@/auth/jwt.strategy'
interface CreateBranchActivityUseCaseRequest {
  // user: UserPayload
  name: string
}

interface CreateBranchActivityUseCaseResponse {
  branchActivity: BranchActivity
}

@Injectable()
export class CreateBranchActivityUseCase {
  constructor(
    private branchesActivityRepository: BranchesActivityRepository,
    // private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    // user,
    name
  }: CreateBranchActivityUseCaseRequest): Promise<CreateBranchActivityUseCaseResponse> {
    const BranchActivityWithSameName =
      await this.branchesActivityRepository.findByName(name)

    if (BranchActivityWithSameName) {
      throw new BranchActivityAlreadyExistsError(name)
    }

    const data = {
      name
    }

    const branchActivity = await this.branchesActivityRepository.create(data)

    // this.eventEmitter.emit(
    //   'BranchActivity.created',
    //   new BranchActivityEvent(BranchActivity.id, user.sub),
    // )

    return {
      branchActivity,
    }
  }
}
