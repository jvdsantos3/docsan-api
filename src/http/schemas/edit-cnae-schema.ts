import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editCnaeParamsSchema = z.object({
  cnaeId: z.string(),
})

export type EditCnaeParamsSchema = z.infer<
  typeof editCnaeParamsSchema
>

export const editCnaeParamsValidationPipe = new ZodValidationPipe(
  editCnaeParamsSchema,
)

const editCnaeBodySchema = z.object({
  code: z.string(),
  description: z.string(),
})

export const editCnaeBodyValidationPipe = new ZodValidationPipe(
  editCnaeBodySchema,
)

export type EditCnaeBodySchema = z.infer<
  typeof editCnaeBodySchema
>
