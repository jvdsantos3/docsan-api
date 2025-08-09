import { Response } from 'express'
import { Controller, Delete, Res } from '@nestjs/common'
import { Public } from '@/auth/public'

@Controller('/sessions')
@Public()
export class LogoutController {
  constructor() {}

  @Delete()
  async handle(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    return { message: 'Logout successful' }
  }
}
