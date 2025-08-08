import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createBranchActivityBodySchema = z.object({
  name: z.string(),
})

export const createBranchActivityValidationPipe = new ZodValidationPipe(
  createBranchActivityBodySchema,
)

export type CreateBranchActivityBodySchema = z.infer<
  typeof createBranchActivityBodySchema
>
