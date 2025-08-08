import { Injectable } from '@nestjs/common'
import { CnaeNotFoundError } from './errors/cnae-not-found-error'
import { CnaesRepository } from '@/database/repositories/cnaes-repository'

interface DeleteCnaeUseCaseRequest {
  cnaeId: string
}

@Injectable()
export class DeleteCnaeUseCase {
  constructor(private cnaesRepository: CnaesRepository) {}

  async execute({
    cnaeId,
  }: DeleteCnaeUseCaseRequest): Promise<void> {
    const cnae =
      await this.cnaesRepository.findById(cnaeId)

    if (!cnae) {
      throw new CnaeNotFoundError()
    }

    await this.cnaesRepository.delete(cnae)
  }
}
