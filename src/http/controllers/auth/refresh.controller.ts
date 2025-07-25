import { Public } from '@/auth/public'
import {
  BadRequestException,
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { WrongCredentialsError } from '@/use-cases/errors/wrong-credentials-error'
import { RefreshUseCase } from '@/use-cases/refresh'
import { Request, Response } from 'express'

@Controller('/refresh')
@Public()
export class RefreshController {
  constructor(private refresh: RefreshUseCase) {}

  @Get()
  async handle(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      const token = req.cookies['refresh_token']

      const { accessToken, refreshToken } = await this.refresh.execute({
        refreshToken: token,
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
