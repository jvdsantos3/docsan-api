import { Encrypter } from '@/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { UsersRepository } from '@/database/repositories/users-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { ProfessionalPendingError } from './errors/professional-pending-error'
import { ProfessionalBannedError } from './errors/professional-banned-error'
import { ProfessionalRejectedError } from './errors/professional-rejected-error'
import { OAuth2Client } from 'google-auth-library';
import { EnvService } from '@/env/env.service'

interface AuthenticateGoogleUseCaseRequest {
  token: string
}

interface AuthenticateGoogleUseCaseResponse {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthenticateGoogleUseCase {
  private googleClient: OAuth2Client;
  

  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter,
    private envService: EnvService
  ) {
    this.googleClient = new OAuth2Client(this.envService.get('GOOGLE_CLIENT_ID'));
  }

  async execute({
    token
  }: AuthenticateGoogleUseCaseRequest): Promise<AuthenticateGoogleUseCaseResponse> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: this.envService.get('GOOGLE_CLIENT_ID'),
    });

    const googleUser = ticket.getPayload();
    if (!googleUser || !googleUser.email) {
      throw new WrongCredentialsError();
    }

    const user = await this.usersRepository.findByEmail(googleUser.email)

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
