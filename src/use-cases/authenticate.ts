import { OwnersRepository } from '@/database/repositories/owners-repository'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { HashComparer } from '@/cryptography/hash-comparer'
import { Encrypter } from '@/cryptography/encrypter'
import { Injectable } from '@nestjs/common'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  accessToken: string
}

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const owner = await this.ownersRepository.findByEmail(email)
    const professional = await this.professionalsRepository.findByEmail(email)

    const user = owner || professional

    if (!user) {
      throw new WrongCredentialsError()
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id,
      role: owner ? 'OWNER' : 'PROFESSIONAL',
    })

    return {
      accessToken,
    }
  }
}
