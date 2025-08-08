import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changeCnaeActiveParamsSchema = z.object({
  cnaeId: z.string(),
})

export type ChangeCnaeActiveParamsSchema = z.infer<
  typeof changeCnaeActiveParamsSchema
>

export const changeCnaeActiveParamsValidationPipe =
  new ZodValidationPipe(changeCnaeActiveParamsSchema)
