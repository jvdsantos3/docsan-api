import { Injectable } from '@nestjs/common'
import { Cnae } from '@prisma/client'
// import { UserPayload } from '@/auth/jwt.strategy'
// import { EventEmitter2 } from '@nestjs/event-emitter'
import { CnaesRepository } from '@/database/repositories/cnaes-repository'
import { CnaeNotFoundError } from './errors/cnae-not-found-error'
import { CnaeAlreadyExistsError } from './errors/cnae-already-exists-error'

interface EditCnaeUseCaseRequest {
  // user: UserPayload
  cnaeId: string
  code: string
  description: string
}

interface EditCnaeUseCaseResponse {
  cnae: Cnae
}

@Injectable()
export class EditCnaeUseCase {
  constructor(
    private cnaesRepository: CnaesRepository,
    // private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    // user,
    cnaeId,
    code,
    description,
  }: EditCnaeUseCaseRequest): Promise<EditCnaeUseCaseResponse> {
    const currentCnae =
      await this.cnaesRepository.findById(cnaeId)

    if (!currentCnae) {
      throw new CnaeNotFoundError()
    }

    const cnaeWithSameCode =
      await this.cnaesRepository.findByCode(code)

    if (cnaeWithSameCode && currentCnae.code !== code) {
      throw new CnaeAlreadyExistsError(code)
    }

    const newCnae = await this.cnaesRepository.save({
      id: cnaeId,
      code,
      description
    })

    // this.eventEmitter.emit(
    //   'cnae.updated',
    //   new CnaeEvent(newCnae.id, user.sub),
    // )

    return {
      cnae: newCnae,
    }
  }
}
