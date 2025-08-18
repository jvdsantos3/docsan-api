import { Response } from 'express'
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common'
import { Public } from '@/auth/public'
import {
  AuthenticateGoogleBodySchema,
  authenticateGoogleValidationPipe,
} from '@/http/schemas/authenticate-google-schema'
import { AuthenticateGoogleUseCase } from '@/use-cases/authenticate-google'

@Controller('/sessions/google')
@Public()
export class AuthenticateGoogleController {
  constructor(private authenticateGoogle: AuthenticateGoogleUseCase) {}

  @Post()
  @UsePipes(authenticateGoogleValidationPipe)
  async handle(
    @Body() body: AuthenticateGoogleBodySchema,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = body

    const { accessToken, refreshToken } = await this.authenticateGoogle.execute({token})

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d,
    })

    return {
      access_token: accessToken,
    }
  }
}
