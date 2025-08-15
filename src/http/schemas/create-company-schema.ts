import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { isValidCPF } from '@brazilian-utils/brazilian-utils'

const createCompanyBodySchema = z.object({
  name: z.string(),
  tradeName: z.string(),
  cnpj: z.string().regex(/^\d{14}$/, {
    message: 'CNPJ deve conter apenas números e ter 14 dígitos',
  }),
  cnaeId: z.string(),
  ownerName: z.string(),
  ownerCpf: z
    .string()
    .regex(/^\d{11}$/, {
      message: 'CPF deve conter apenas números e ter 11 dígitos',
    })
    .refine((val) => isValidCPF(val), { message: 'CPF inválido' }),
  phone: z
    .string()
    .regex(/^\d+$/, { message: 'Telefone deve conter apenas números' }),
  ownerEmail: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .regex(/[A-Z]/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'A senha deve conter pelo menos um caractere especial',
    }),
  zipCode: z.string().regex(/^\d{8}$/, {
    message: 'CEP deve conter apenas números e ter 8 dígitos',
  }),
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
