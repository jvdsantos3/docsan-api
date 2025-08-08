import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changeBranchActivityActiveParamsSchema = z.object({
  branchActivityId: z.string(),
})

export type ChangeBranchActivityActiveParamsSchema = z.infer<
  typeof changeBranchActivityActiveParamsSchema
>

export const changeBranchActivityActiveParamsValidationPipe =
  new ZodValidationPipe(changeBranchActivityActiveParamsSchema)
