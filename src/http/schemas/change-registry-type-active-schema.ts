import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changeRegistryTypeActiveParamsSchema = z.object({
  registryTypeId: z.string(),
})

export type ChangeRegistryTypeActiveParamsSchema = z.infer<
  typeof changeRegistryTypeActiveParamsSchema
>

export const changeRegistryTypeActiveParamsValidationPipe =
  new ZodValidationPipe(changeRegistryTypeActiveParamsSchema)
