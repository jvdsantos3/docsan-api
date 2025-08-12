import { ProfessionalShow } from './../database/repositories/professionals-repository'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ProfessionalNotFoundError } from './errors/professional-not-found-error'

interface GetProfessionalUseCaseRequest {
  professionalId: string
}

interface GetProfessionalUseCaseResponse {
  professional: Prisma.ProfessionalGetPayload<ProfessionalShow>
}

@Injectable()
export class GetProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    professionalId,
  }: GetProfessionalUseCaseRequest): Promise<GetProfessionalUseCaseResponse> {
    const professional = await this.professionalsRepository.show(professionalId)

    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    return {
      professional,
    }
  }
}
