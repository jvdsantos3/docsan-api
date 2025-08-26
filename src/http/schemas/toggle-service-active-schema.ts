import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const toggleServiceActiveSchema = z.object({
  serviceId: z.string().uuid({
    message: 'O ID do serviço deve ser um UUID válido.',
  }),
})

export type ToggleServiceActiveSchema = z.infer<
  typeof toggleServiceActiveSchema
>

export const toggleServiceActiveValidationPipe = new ZodValidationPipe(
  toggleServiceActiveSchema,
)
