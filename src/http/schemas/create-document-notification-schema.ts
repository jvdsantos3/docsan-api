import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createDocumentNotificationParamsSchema = z.object({
  documentId: z.string(),
})

export type CreateDocumentNotificationParamsSchema = z.infer<
  typeof createDocumentNotificationParamsSchema
>

export const createDocumentNotificationValidationPipe = new ZodValidationPipe(
  createDocumentNotificationParamsSchema,
)

const createDocumentNotificationBodySchema = z.object({
  time: z.coerce.number(),
  period: z.enum(['week', 'month']),
})

export const createDocumentNotificationBodyValidationPipe =
  new ZodValidationPipe(createDocumentNotificationBodySchema)

export type CreateDocumentNotificationBodySchema = z.infer<
  typeof createDocumentNotificationBodySchema
>
