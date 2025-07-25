import { Public } from '@/auth/public'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/use-cases/errors/wrong-credentials-error'
import { Response } from 'express'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(
    @Body() body: AuthenticateBodySchema,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body

    try {
      const { accessToken, refreshToken } = await this.authenticate.execute({
        email,
        password,
      })

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return {
        access_token: accessToken,
      }
    } catch (err: any) {
      switch (err.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(err.message)
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
