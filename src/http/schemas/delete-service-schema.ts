import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'
import { z } from 'zod'

export const deleteServiceParamsSchema = z.object({
  serviceId: z.string().uuid({
    message: 'ID deve ser um UUID válido.',
  }),
})

export type DeleteServiceParamsSchema = z.infer<
  typeof deleteServiceParamsSchema
>

export const deleteServiceValidationPipe = new ZodValidationPipe(
  deleteServiceParamsSchema,
)
