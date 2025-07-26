import { Public } from '@/auth/public'
import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { RefreshUseCase } from '@/use-cases/refresh'
import { Request, Response } from 'express'

@Controller('/refresh')
@Public()
export class RefreshController {
  constructor(private refresh: RefreshUseCase) {}

  @Get()
  async handle(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token']

    if (!token) {
      throw new UnauthorizedException('Refresh token not found.')
    }

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
  }
}
