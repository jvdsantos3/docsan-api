import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const rejectProfessionalParamsSchema = z.object({
  professionalId: z.string(),
})

export type RejectProfessionalParamsSchema = z.infer<
  typeof rejectProfessionalParamsSchema
>

export const rejectProfessionalParamsValidationPipe = new ZodValidationPipe(
  rejectProfessionalParamsSchema,
)

const rejectProfessionalBodySchema = z.object({
  reason: z.string(),
})

export type RejectProfessionalBodySchema = z.infer<
  typeof rejectProfessionalBodySchema
>

export const rejectProfessionalBodyValidationPipe = new ZodValidationPipe(
  rejectProfessionalBodySchema,
)
