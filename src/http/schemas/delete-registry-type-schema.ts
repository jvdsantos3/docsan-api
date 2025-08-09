import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deleteRegistryTypeParamsSchema = z.object({
  registryTypeId: z.string(),
})

export type DeleteRegistryTypeParamsSchema = z.infer<
  typeof deleteRegistryTypeParamsSchema
>

export const deleteRegistryTypeParamsValidationPipe = new ZodValidationPipe(
  deleteRegistryTypeParamsSchema,
)
