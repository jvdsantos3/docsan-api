import { RegisterCompanyUseCase } from '@/use-cases/register-company'
import { Public } from '@/auth/public'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import {
  CreateCompanyBodySchema,
  createCompanyValidationPipe,
} from '@/http/schemas/create-company-schema'

@Controller('/companies')
@Public()
export class CreateCompanyController {
  constructor(private registerCompanyUseCase: RegisterCompanyUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(createCompanyValidationPipe())
  async handle(@Body() body: CreateCompanyBodySchema) {
    const { company } = await this.registerCompanyUseCase.execute(body)

    return {
      company,
    }
  }
}
