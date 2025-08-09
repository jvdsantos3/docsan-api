import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getRegistryTypeParamsSchema = z.object({
  registryTypeId: z.string(),
})

export type GetRegistryTypeParamsSchema = z.infer<
  typeof getRegistryTypeParamsSchema
>

export const getRegistryTypeParamsValidationPipe =
  new ZodValidationPipe(getRegistryTypeParamsSchema)
