import { Response } from 'express'
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common'
import { Public } from '@/auth/public'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import {
  AuthenticateBodySchema,
  authenticateValidationPipe,
} from '@/http/schemas/authenticate-schema'

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @UsePipes(authenticateValidationPipe)
  async handle(
    @Body() body: AuthenticateBodySchema,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body

    const { accessToken, refreshToken } = await this.authenticate.execute({
      email,
      password,
    })

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
