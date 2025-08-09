import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editRegistryTypeParamsSchema = z.object({
  registryTypeId: z.string(),
})

export type EditRegistryTypeParamsSchema = z.infer<
  typeof editRegistryTypeParamsSchema
>

export const editRegistryTypeParamsValidationPipe = new ZodValidationPipe(
  editRegistryTypeParamsSchema,
)

const editRegistryTypeBodySchema = z.object({
  name: z.string(),
})

export const editRegistryTypeBodyValidationPipe = new ZodValidationPipe(
  editRegistryTypeBodySchema,
)

export type EditRegistryTypeBodySchema = z.infer<
  typeof editRegistryTypeBodySchema
>
