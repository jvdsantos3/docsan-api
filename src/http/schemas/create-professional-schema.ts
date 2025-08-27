import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { isValidCPF } from '@brazilian-utils/brazilian-utils'

const createProfessionalBodySchema = z
  .object({
    name: z.string(),
    cpf: z
      .string()
      .regex(/^\d{11}$/, {
        message: 'CPF deve conter apenas números e ter 11 dígitos',
      })
      .refine((val) => isValidCPF(val), { message: 'CPF inválido' }),
    birthDate: z
      .string()
      .transform((val) => new Date(val))
      .refine(
        (date) => {
          const hoje = new Date()
          const maioridade = new Date(
            date.getFullYear() + 18,
            date.getMonth(),
            date.getDate(),
          )
          return maioridade <= hoje
        },
        { message: 'O profissional deve ter pelo menos 18 anos' },
      ),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
      .regex(/[A-Z]/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: 'A senha deve conter pelo menos um caractere especial',
      }),
    phone: z
      .string()
      .regex(/^\d+$/, { message: 'Telefone deve conter apenas números' }),
    classification: z.enum(['PERSON', 'COMPANY']).default('PERSON'),
    cnpj: z
      .string()
      .regex(/^\d{14}$/, {
        message: 'CNPJ deve conter apenas números e ter 14 dígitos',
      })
      .optional(),
    branchActivityId: z.string(),
    registryTypeId: z.string(),
    registry: z.string(),
    registryUf: z.string(),
    cnaeId: z.string().optional(),
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
  .superRefine((data, ctx) => {
    if (data.classification === 'COMPANY') {
      if (!data.cnpj) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CNPJ é obrigatório quando classification for COMPANY',
          path: ['cnpj'],
        })
      }
    }
  })

export type CreateProfessionalBodySchema = z.infer<
  typeof createProfessionalBodySchema
>

export const createProfessionalValidationPipe = new ZodValidationPipe(
  createProfessionalBodySchema,
)
