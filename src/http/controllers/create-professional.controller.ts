import { RegisterProfessionalUseCase } from '@/use-cases/register-professional'
import { Public } from '@/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createProfessionalBodySchema = z.object({
  name: z.string(),
  // TODO
  cpf: z.string(),
  birthDate: z
    .string()
    .transform((val) => new Date(val)),
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

type CreateProfessionalBodySchema = z.infer<typeof createProfessionalBodySchema>

@Controller('/professionals')
@Public()
export class CreateProfessionalController {
  constructor(
    private registerProfessionalUseCase: RegisterProfessionalUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createProfessionalBodySchema))
  async handle(@Body() body: CreateProfessionalBodySchema) {
    try {
      await this.registerProfessionalUseCase.execute(body)
    } catch (err: any) {
      switch (err.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(err.message)
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
