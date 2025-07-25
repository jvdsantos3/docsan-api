import { Public } from '@/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/use-cases/errors/wrong-credentials-error'
import { RefreshUseCase } from '@/use-cases/refresh'

const refreshBodySchema = z.object({
  token: z.string(),
})

type RefreshBodySchema = z.infer<typeof refreshBodySchema>

@Controller('/refresh')
@Public()
export class RefreshController {
  constructor(private refresh: RefreshUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(refreshBodySchema))
  async handle(@Body() body: RefreshBodySchema) {
    const { token } = body

    try {
      const { accessToken, refreshToken } = await this.refresh.execute({
        refreshToken: token,
      })

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
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
