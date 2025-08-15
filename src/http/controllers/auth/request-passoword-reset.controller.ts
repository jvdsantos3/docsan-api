import { Public } from '@/auth/public'
import {
  requestPassowordResetValidationPipe,
  RequestPasswordResetBodySchema,
} from './../../schemas/request-password-reset-schema'
import { RequestPasswordResetUseCase } from '@/use-cases/request-password-reset'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('/password/request-reset')
export class RequestPasswordResetController {
  constructor(
    private readonly requestPasswordReset: RequestPasswordResetUseCase,
  ) {}

  @Post()
  @Public()
  async handle(
    @Body(requestPassowordResetValidationPipe)
    { email }: RequestPasswordResetBodySchema,
  ) {
    await this.requestPasswordReset.execute({ email })

    return {
      message: 'Password reset link sent successfully.',
    }
  }
}
