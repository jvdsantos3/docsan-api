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
import { RegisterCompanyUseCase } from '@/domain/application/use-cases/register-company'
import { CompanyAlreadyExistsError } from '@/domain/application/use-cases/errors/company-already-exists-error'

const createCompanyBodySchema = z.object({
  name: z.string(),
  cnpj: z.string(),
  birthDate: z
    .string()
    .date()
    .transform((val) => new Date(val)),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  fieldExpertise: z.string(),
  companyRegistry: z.string(),
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

const bodyValidationPipe = new ZodValidationPipe(createCompanyBodySchema)

type CreateCompanyBodySchema = z.infer<typeof createCompanyBodySchema>

@Controller('/companys')
@Public()
export class CreateCompanyController {
  constructor(private registerCompany: RegisterCompanyUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateCompanyBodySchema) {
    const result = await this.registerCompany.execute(body)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CompanyAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
