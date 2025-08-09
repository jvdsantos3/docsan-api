import { Injectable } from '@nestjs/common'
import { Cnae} from '@prisma/client'
import { CnaesRepository } from '@/database/repositories/cnaes-repository'
import { CnaeAlreadyExistsError } from './errors/cnae-already-exists-error'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UserPayload } from '@/auth/jwt.strategy'
import { CnaeEvent } from '@/events/cnae.event'
interface CreateCnaeUseCaseRequest {
  user: UserPayload
  code: string
  description: string
}

interface CreateCnaeUseCaseResponse {
  cnae: Cnae
}

@Injectable()
export class CreateCnaeUseCase {
  constructor(
    private cnaesRepository: CnaesRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user,
    code,
    description,
  }: CreateCnaeUseCaseRequest): Promise<CreateCnaeUseCaseResponse> {
    const cnaeWithSameCode =
      await this.cnaesRepository.findByCode(code)

    if (cnaeWithSameCode) {
      throw new CnaeAlreadyExistsError(code)
    }

    const data = {
      code,
      description,
    }

    const cnae = await this.cnaesRepository.create(data)

    this.eventEmitter.emit(
      'cnae.created',
      new CnaeEvent(cnae.id, user.sub),
    )

    return {
      cnae,
    }
  }
}
