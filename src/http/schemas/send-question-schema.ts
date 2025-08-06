import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const SendQuestionBodySchema = z.object({
  prompt: z.string(),
})

export type SendQuestionBodySchema = z.infer<typeof SendQuestionBodySchema>

export const sendQuestionValidationPipe = new ZodValidationPipe(
  SendQuestionBodySchema,
)
