import { Public } from '@/auth/public'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/use-cases/errors/wrong-credentials-error'

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
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    try {
      const { accessToken } = await this.authenticate.execute({
        email,
        password,
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
