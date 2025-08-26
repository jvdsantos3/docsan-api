import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createRegistryTypeBodySchema = z.object({
  branchActivityId: z.string().uuid(),
  name: z.string(),
  fullName: z.string(),
})

export const createRegistryTypeValidationPipe = new ZodValidationPipe(
  createRegistryTypeBodySchema,
)

export type CreateRegistryTypeBodySchema = z.infer<
  typeof createRegistryTypeBodySchema
>
