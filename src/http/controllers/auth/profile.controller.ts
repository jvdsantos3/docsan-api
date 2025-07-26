import { Controller, Get } from '@nestjs/common'
import { GetProfileUseCase } from '@/use-cases/get-profile'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

@Controller('/profile')
export class ProfileController {
  constructor(private getProfile: GetProfileUseCase) {}

  @Get()
  async handle(@CurrentUser() payload: UserPayload) {
    const profile = await this.getProfile.execute({ payload })

    return profile
  }
}
