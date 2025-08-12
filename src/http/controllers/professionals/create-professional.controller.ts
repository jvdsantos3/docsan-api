import { RegisterProfessionalUseCase } from '@/use-cases/register-professional'
import { Public } from '@/auth/public'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import {
  CreateProfessionalBodySchema,
  createProfessionalValidationPipe,
} from '@/http/schemas/create-professional-schema'

@Controller('/professionals')
@Public()
export class CreateProfessionalController {
  constructor(private registerProfessional: RegisterProfessionalUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(createProfessionalValidationPipe) body: CreateProfessionalBodySchema,
  ) {
    await this.registerProfessional.execute(body)

    return {
      message: 'Professional registered successfully.',
      description:
        'Your profile is being analyzed by our administrators, you will soon receive feedback on the analysis.',
    }
  }
}
