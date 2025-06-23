import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ProfessionalsRepository } from '../repositories/professionals-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { CompaniesRepository } from '../repositories/companies-repository'
import { Professional } from '@/domain/enterprise/entities/professional'
import { Company } from '@/domain/enterprise/entities/company'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private companiesRepository: CompaniesRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    let user: Professional | Company | null =
      await this.professionalsRepository.findByEmail(email)
    let type = 'professional'

    if (!user) {
      user = await this.companiesRepository.findByEmail(email)
      type = 'company'

      if (!user) {
        return left(new WrongCredentialsError())
      }
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      throw new WrongCredentialsError()
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: type,
    })

    return right({
      accessToken,
    })
  }
}
