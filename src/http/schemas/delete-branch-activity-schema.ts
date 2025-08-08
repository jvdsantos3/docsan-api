import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteBranchActivityParamsSchema = z.object({
  branchActivityId: z.string(),
})

export type DeleteBranchActivityParamsSchema = z.infer<
  typeof deleteBranchActivityParamsSchema
>

export const deleteBranchActivityParamsValidationPipe = new ZodValidationPipe(
  deleteBranchActivityParamsSchema,
)
