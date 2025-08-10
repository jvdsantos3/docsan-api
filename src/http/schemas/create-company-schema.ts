import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createCompanyBodySchema = z.object({
  name: z.string(),
  tradeName: z.string(),
  cnpj: z.string(),
  cnaeId: z.string(),
  ownerName: z.string(),
  ownerCpf: z.string(),
  phone: z.string(),
  ownerEmail: z.string().email(),
  password: z.string(),
  zipCode: z.string(),
  uf: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.coerce.string(),
  neighborhood: z.string(),
  complement: z.string().optional(),
})

export type CreateCompanyBodySchema = z.infer<typeof createCompanyBodySchema>

export const createCompanyValidationPipe = new ZodValidationPipe(
  createCompanyBodySchema,
)
