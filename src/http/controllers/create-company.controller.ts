import { RegisterCompanyUseCase } from '@/use-cases/register-company'
import { Public } from '@/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createCompanyBodySchema = z.object({
  name: z.string(),
  tradeName: z.string(),
  cnpj: z.string(),
  cnae: z.string(),
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

const bodyValidationPipe = new ZodValidationPipe(createCompanyBodySchema)

type CreateCompanyBodySchema = z.infer<typeof createCompanyBodySchema>

@Controller('/companies')
@Public()
export class CreateCompanyController {
  constructor(private registerCompanyUseCase: RegisterCompanyUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateCompanyBodySchema) {
    try {
      await this.registerCompanyUseCase.execute(body)
    } catch (err) {
      switch (err.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(err.message)
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
