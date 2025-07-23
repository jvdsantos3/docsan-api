import { OwnersRepository } from '@/database/repositories/owners-repository'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'
import { Owner, Professional } from '@prisma/client'
import { User } from './interfaces/use'

interface GetProfileUseCaseRequest {
  user: User
}

interface AuthenticateUseCaseResponse {
  profile: Professional | Owner
}

@Injectable()
export class GetProfileUseCase {
  constructor(
    private ownersRepository: OwnersRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    user,
  }: GetProfileUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const owner = await this.ownersRepository.findByIdWithCompany(user.sub)
    const professional = await this.professionalsRepository.findById(user.sub)

    const profile = owner || professional

    if (!profile) {
      // TODO
      throw new Error('User not found.')
    }

    return {
      profile,
    }
  }
}
