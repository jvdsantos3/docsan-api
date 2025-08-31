import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const associateServiceParamSchema = z.object({
  serviceId: z.string().uuid({
    message: 'O ID do serviço deve ser um UUID válido.',
  }),
})

export type AssociateServiceParamSchema = z.infer<
  typeof associateServiceParamSchema
>

export const associateServiceParamValidationPipe = new ZodValidationPipe(
  associateServiceParamSchema,
)

const paymentMethodEnum = z.enum(
  ['PIX', 'BOLETO', 'DEBIT_CARD', 'CREDIT_CARD'],
  {
    errorMap: () => ({
      message:
        'Forma de pagamento inválida. Use: PIX, BOLETO, DEBIT_CARD ou CREDIT_CARD.',
    }),
  },
)

const associateServiceBodySchema = z
  .object({
    price: z
      .number()
      .int({
        message: 'O preço deve ser um número inteiro (em centavos).',
      })
      .positive({
        message: 'O preço deve ser um número positivo.',
      }),
    paymentMethods: z
      .array(paymentMethodEnum)
      .min(1, {
        message: 'Pelo menos uma forma de pagamento deve ser selecionada.',
      })
      .refine(
        (methods) => {
          const uniqueMethods = [...new Set(methods)]
          return uniqueMethods.length === methods.length
        },
        {
          message: 'Não é possível ter formas de pagamento duplicadas.',
        },
      ),
    maxInstallments: z
      .number()
      .int({
        message: 'O número máximo de parcelas deve ser um número inteiro.',
      })
      .positive({
        message: 'O número máximo de parcelas deve ser positivo.',
      })
      .max(12, {
        message: 'O número máximo de parcelas não pode exceder 12.',
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.paymentMethods.includes('CREDIT_CARD') &&
        !data.maxInstallments
      ) {
        return false
      }
      return true
    },
    {
      message:
        'Número máximo de parcelas é obrigatório quando cartão de crédito é aceito.',
      path: ['maxInstallments'],
    },
  )
  .refine(
    (data) => {
      if (
        !data.paymentMethods.includes('CREDIT_CARD') &&
        data.maxInstallments
      ) {
        return false
      }
      return true
    },
    {
      message:
        'Número máximo de parcelas só deve ser fornecido quando cartão de crédito é aceito.',
      path: ['maxInstallments'],
    },
  )

export type AssociateServiceBodySchema = z.infer<
  typeof associateServiceBodySchema
>

export const associateServiceBodyValidationPipe = new ZodValidationPipe(
  associateServiceBodySchema,
)
