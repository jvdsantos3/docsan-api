import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editBranchActivityParamsSchema = z.object({
  branchActivityId: z.string(),
})

export type EditBranchActivityParamsSchema = z.infer<
  typeof editBranchActivityParamsSchema
>

export const editBranchActivityParamsValidationPipe = new ZodValidationPipe(
  editBranchActivityParamsSchema,
)

const editBranchActivityBodySchema = z.object({
  name: z.string(),
})

export const editBranchActivityBodyValidationPipe = new ZodValidationPipe(
  editBranchActivityBodySchema,
)

export type EditBranchActivityBodySchema = z.infer<
  typeof editBranchActivityBodySchema
>
