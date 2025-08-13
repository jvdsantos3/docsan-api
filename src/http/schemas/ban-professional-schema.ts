import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const banProfessionalParamsSchema = z.object({
  professionalId: z.string(),
})

export type BanProfessionalParamsSchema = z.infer<
  typeof banProfessionalParamsSchema
>

export const banProfessionalParamsValidationPipe = new ZodValidationPipe(
  banProfessionalParamsSchema,
)

const banProfessionalBodySchema = z.object({
  reason: z.string(),
})

export type BanProfessionalBodySchema = z.infer<
  typeof banProfessionalBodySchema
>

export const banProfessionalBodyValidationPipe = new ZodValidationPipe(
  banProfessionalBodySchema,
)
