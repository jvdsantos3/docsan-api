import { Public } from '@/auth/public'
import { Body, Controller, Post } from '@nestjs/common'
import { ResetPasswordUseCase } from '@/use-cases/reset-password'
import {
  ResetPasswordBodySchema,
  resetPasswordValidationPipe,
} from '@/http/schemas/reset-password-schema'

@Controller('/password/reset')
export class ResetPasswordController {
  constructor(private readonly resetPassword: ResetPasswordUseCase) {}

  @Post()
  @Public()
  async handle(
    @Body(resetPasswordValidationPipe)
    { token, newPassword }: ResetPasswordBodySchema,
  ) {
    await this.resetPassword.execute({ token, newPassword })

    return {
      message: 'Password reset successfully.',
    }
  }
}
