import { CnaesRepository } from '@/database/repositories/cnaes-repository'
import { Injectable } from '@nestjs/common'
import { Cnae } from '@prisma/client'
import { CnaeNotFoundError } from './errors/cnae-not-found-error'

interface ChangeCnaeUseCaseRequest {
  cnaeId: string
}

interface ChangeCnaeUseCaseResponse {
  cnae: Cnae
}

@Injectable()
export class ChangeCnaeActiveUseCase {
  constructor(private cnaesRepository: CnaesRepository) {}

  async execute({
    cnaeId,
  }: ChangeCnaeUseCaseRequest): Promise<ChangeCnaeUseCaseResponse> {
    const cnae =
      await this.cnaesRepository.findById(cnaeId)

    if (!cnae) {
      throw new CnaeNotFoundError()
    }

    const newCnae = await this.cnaesRepository.save({
      id: cnae.id,
      isActive: !cnae.isActive,
    })

    return {
      cnae: newCnae,
    }
  }
}
