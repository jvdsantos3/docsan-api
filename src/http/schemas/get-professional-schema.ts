import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getProfessionalParamsSchema = z.object({
  professionalId: z.string(),
})

export type GetProfessionalParamsSchema = z.infer<
  typeof getProfessionalParamsSchema
>

export const getProfessionalParamsValidationPipe = new ZodValidationPipe(
  getProfessionalParamsSchema,
)
