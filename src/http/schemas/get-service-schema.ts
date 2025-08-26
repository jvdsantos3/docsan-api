import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import { z } from 'zod'

export const getServiceParamsSchema = z.object({
  serviceId: z.string().uuid({
    message: 'ID deve ser um UUID válido.',
  }),
})

export type GetServiceParamsSchema = z.infer<typeof getServiceParamsSchema>

export const getServiceValidationPipe = new ZodValidationPipe(
  getServiceParamsSchema,
)
