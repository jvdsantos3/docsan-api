import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const toggleServiceHighlightedSchema = z.object({
  serviceId: z.string().uuid({
    message: 'O ID do serviço deve ser um UUID válido.',
  }),
})

export type ToggleServiceHighlightedSchema = z.infer<
  typeof toggleServiceHighlightedSchema
>

export const toggleServiceHighlightedValidationPipe = new ZodValidationPipe(
  toggleServiceHighlightedSchema,
)
