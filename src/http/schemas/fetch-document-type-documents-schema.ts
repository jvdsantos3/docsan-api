import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const fetchDocumentTypeDocumentsParamsSchema = z.object({
  documentTypeId: z.string(),
})

export type FetchDocumentTypeDocumentsParamsSchema = z.infer<
  typeof fetchDocumentTypeDocumentsParamsSchema
>

export const fetchDocumentTypeDocumentsParamsValidationPipe =
  new ZodValidationPipe(fetchDocumentTypeDocumentsParamsSchema)

const fetchDocumentTypyDocumentsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .optional()
    .default('15')
    .transform(Number)
    .pipe(z.number().min(1)),
  order: z.enum(['desc', 'asc']).optional(),
  orderBy: z.enum(['name', 'createdAt']).optional(),
  filter: z.string().optional(),
})

export const fetchDocumentTypeDocumentsQueryValidationPipe =
  new ZodValidationPipe(fetchDocumentTypyDocumentsQuerySchema)

export type FetchDocumentTypyDocumentsQuerySchema = z.infer<
  typeof fetchDocumentTypyDocumentsQuerySchema
>
