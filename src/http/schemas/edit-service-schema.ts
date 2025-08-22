import { z } from 'zod'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'

const editServiceParamsSchema = z.object({
  serviceId: z.string(),
})

export type EditServiceParamsSchema = z.infer<typeof editServiceParamsSchema>

export const editServiceParamsValidationPipe = new ZodValidationPipe(
  editServiceParamsSchema,
)

const editServiceBodySchema = z.object({
  name: z.string(),
  summary: z.string(),
  description: z.string(),
})

export const editServiceValidationPipe = new ZodValidationPipe(
  editServiceBodySchema,
)

export type EditServiceBodySchema = z.infer<typeof editServiceBodySchema>
