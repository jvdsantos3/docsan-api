import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createProfessionalBodySchema = z.object({
  name: z.string(),
  // TODO
  cpf: z.string(),
  birthDate: z.string().transform((val) => new Date(val)),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  fieldActivity: z.string(),
  // TODO
  registry: z.string(),
  registryUf: z.string(),
  // TODO
  cnae: z.string(),
  // TODO
  zipCode: z.string(),
  uf: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.coerce.string(),
  neighborhood: z.string(),
  complement: z.string().optional(),
})

export type CreateProfessionalBodySchema = z.infer<typeof createProfessionalBodySchema>

export function createProfessionalValidationPipe() {
  return new ZodValidationPipe(createProfessionalBodySchema)
}
