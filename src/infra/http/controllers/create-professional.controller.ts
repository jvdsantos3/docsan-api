import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { cpfSchema } from '@/utils/schemas/cpf-schema'
import { RegisterProfessionalUseCase } from '@/domain/application/use-cases/register-professional'
import { ProfessionalAlreadyExistsError } from '@/domain/application/use-cases/errors/professional-already-exists-error'

const createProfessionalBodySchema = z.object({
  name: z.string(),
  cpf: cpfSchema,
  birthDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  fieldExpertise: z.string(),
  professionalRegistry: z.string(),
  registryUf: z.string(),
  cnae: z.string(),
  zipCode: z.string(),
  uf: z.string(),
  city: z.string(),
  street: z.string(),
  number: z.coerce.string(),
  neighborhood: z.string(),
  complement: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createProfessionalBodySchema)

type CreateProfessionalBodySchema = z.infer<typeof createProfessionalBodySchema>

@Controller('/professionals')
@Public()
export class CreateProfessionalController {
  constructor(private registerProfessional: RegisterProfessionalUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateProfessionalBodySchema) {
    const result = await this.registerProfessional.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ProfessionalAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
