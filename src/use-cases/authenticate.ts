import { HashComparer } from '@/cryptography/hash-comparer'
import { Encrypter } from '@/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@/database/repositories/users-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { ProfessionalPendingError } from './errors/professional-pending-error'
import { ProfessionalBannedError } from './errors/professional-banned-error'
import { ProfessionalRejectedError } from './errors/professional-rejected-error'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new WrongCredentialsError()
    }

    if (user.professional) {
      const professional = user.professional

      switch (professional.status) {
        case 'PENDING':
          throw new ProfessionalPendingError()
        case 'REJECTED':
          throw new ProfessionalRejectedError()
        case 'BANNED':
          throw new ProfessionalBannedError()
      }
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new WrongCredentialsError()
    }

    const payload = {
      sub: user.id,
      role: user.role,
    }

    const accessToken = await this.encrypter.encrypt(
      { ...payload, type: 'access' },
      {
        expiresIn: '1h',
      },
    )

    const refreshToken = await this.encrypter.encrypt(
      { ...payload, type: 'refresh' },
      {
        expiresIn: '7d',
      },
    )

    return {
      accessToken,
      refreshToken,
    }
  }
}
