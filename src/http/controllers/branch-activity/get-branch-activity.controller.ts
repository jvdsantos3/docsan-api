import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { GetBranchActivitByIdUseCase } from '@/use-cases/get-branch-activity-by-id'
import {
  GetBranchActivityParamsSchema,
  getBranchActivityParamsValidationPipe,
} from '@/http/schemas/get-branch-activity-schema'
import { Public } from '@/auth/public'

@Controller('branches-activity/:branchActivityId')
export class GetBranchActivitController {
  constructor(private getBranchActivityById: GetBranchActivitByIdUseCase) {}

  @Get()
  @Public()
  async handle(
    @Param(getBranchActivityParamsValidationPipe)
    { branchActivityId }: GetBranchActivityParamsSchema,
  ) {
    const { branchActivity } = await this.getBranchActivityById.execute({
      branchActivityId,
    })

    return branchActivity
  }
}
