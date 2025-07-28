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
