import { Encrypter } from '@/cryptography/encrypter'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersRepository } from '@/database/repositories/users-repository'

interface AuthenticateUseCaseRequest {
  refreshToken: string
}

interface AuthenticateUseCaseResponse {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class RefreshUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    refreshToken,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const payload = await this.encrypter.verify(refreshToken)

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type')
    }

    const user = await this.usersRepository.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const newPayload = {
      sub: user.id,
      role: user.role,
    }

    const newAccessToken = await this.encrypter.encrypt(
      { ...newPayload, type: 'access' },
      { expiresIn: '60s' },
    )

    const newRefreshToken = await this.encrypter.encrypt(
      { ...newPayload, type: 'refresh' },
      { expiresIn: '1h' },
    )

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }
}
