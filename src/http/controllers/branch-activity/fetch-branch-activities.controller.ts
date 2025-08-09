import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { FetchBranchesActivityUseCase } from '@/use-cases/fetch-branches-activity'
import {
  FetchBranchesActivityQuerySchema,
  FetchBranchesActivityQueryValidationPipe,
} from '@/http/schemas/fetch-branches-activity-schema'
import { Public } from '@/auth/public'

@Controller('/branches-activity')
export class FetchBranchesActivityController {
  constructor(
    private fetchBranchesActivityUseCase: FetchBranchesActivityUseCase,
  ) {}

  @Get()
  @Public()
  async handle(
    @Query(FetchBranchesActivityQueryValidationPipe)
    { page, limit, order, active, filter }: FetchBranchesActivityQuerySchema,
  ) {
    const branchesActivity = await this.fetchBranchesActivityUseCase.execute({
      page,
      limit,
      order,
      active,
      filter,
    })

    return branchesActivity
  }
}
