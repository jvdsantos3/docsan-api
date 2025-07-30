import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const extractDataParamsSchema = z.object({
  companyId: z.string(),
})

export type ExtractDataParamsSchema = z.infer<
  typeof extractDataParamsSchema
>

export const extractDataParamsValidationPipe = new ZodValidationPipe(
  extractDataParamsSchema,
)

const extractDataBodySchema = z.object({
  documentTypeId: z.string(),
})

export const extractDataBodyValidationPipe = new ZodValidationPipe(
  extractDataBodySchema,
)

export type ExtractDataBodySchema = z.infer<typeof extractDataBodySchema>
