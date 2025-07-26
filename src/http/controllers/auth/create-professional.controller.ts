import { RegisterProfessionalUseCase } from '@/use-cases/register-professional'
import { Public } from '@/auth/public'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import {
  CreateProfessionalBodySchema,
  createProfessionalValidationPipe,
} from '@/http/schemas/create-professional-schema'

@Controller('/professionals')
@Public()
export class CreateProfessionalController {
  constructor(
    private registerProfessional: RegisterProfessionalUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(createProfessionalValidationPipe)
  async handle(@Body() body: CreateProfessionalBodySchema) {
    await this.registerProfessional.execute(body)
  }
}
