import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const approveProfessionalParamsSchema = z.object({
  professionalId: z.string(),
})

export type ApproveProfessionalParamsSchema = z.infer<
  typeof approveProfessionalParamsSchema
>

export const approveProfessionalParamsValidationPipe = new ZodValidationPipe(
  approveProfessionalParamsSchema,
)
