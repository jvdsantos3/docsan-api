import { DocumentTypesRepository } from '@/database/repositories/document-types-repository'
import { Injectable } from '@nestjs/common'
import { Cnae } from '@prisma/client'
import { CnaesRepository } from '@/database/repositories/cnaes-repository'
import { CnaeNotFoundError } from './errors/cnae-not-found-error'

interface GetCnaeByIdUseCaseRequest {
  cnaeId: string
}

interface GetCnaeByIdUseCaseResponse {
  cnae: Cnae
}

@Injectable()
export class GetCnaeByIdUseCase {
  constructor(private cnaesRepository: CnaesRepository) {}

  async execute({
    cnaeId,
  }: GetCnaeByIdUseCaseRequest): Promise<GetCnaeByIdUseCaseResponse> {
    const cnae =
      await this.cnaesRepository.findById(cnaeId)

    if (!cnae) {
      throw new CnaeNotFoundError()
    }

    return {
      cnae,
    }
  }
}
