import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getBranchActivityParamsSchema = z.object({
  branchActivityId: z.string(),
})

export type GetBranchActivityParamsSchema = z.infer<
  typeof getBranchActivityParamsSchema
>

export const getBranchActivityParamsValidationPipe = new ZodValidationPipe(
  getBranchActivityParamsSchema,
)
