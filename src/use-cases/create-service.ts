import { Injectable } from '@nestjs/common'
import { Prisma, Service } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UserPayload } from '@/auth/jwt.strategy'
import { ServicesRepository } from '@/database/repositories/services-repository'
import { ServiceAlreadyExistsError } from './errors/service-already-exists-error'
import { UserNotFoundError } from './errors/user-not-found-error'
import { UsersRepository } from '@/database/repositories/users-repository'
import { randomUUID } from 'node:crypto'
import { Uploader } from '@/storage/upload'
import { ServiceEvent } from '@/events/service.event'

interface CreateServiceUseCaseRequest {
  payload: UserPayload
  name: string
  summary: string
  description: string
  fileName?: string
  fileType?: string
  body?: Buffer
}

interface CreateServiceUseCaseResponse {
  service: Service
}

@Injectable()
export class CreateServiceUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private servicesRepository: ServicesRepository,
    private uploader: Uploader,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    payload,
    name,
    summary,
    description,
    fileName,
    fileType,
    body,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const user = await this.usersRepository.findById(payload.sub)

    if (!user) {
      throw new UserNotFoundError()
    }

    const serviceWithSameName = await this.servicesRepository.findByName(name)

    if (serviceWithSameName) {
      throw new ServiceAlreadyExistsError(name)
    }

    let imageUrl: string | null = null

    if (fileName && fileType && body) {
      const { url } = await this.uploader.upload({
        fileName: `services/images/${randomUUID()}-${fileName}`,
        fileType,
        body,
      })

      imageUrl = url
    }

    const data: Prisma.ServiceCreateInput = {
      name,
      summary,
      description,
      imageUrl,
    }

    const service = await this.servicesRepository.create(data)

    this.eventEmitter.emit(
      'service.created',
      new ServiceEvent(service.id, payload.sub),
    )

    return {
      service,
    }
  }
}
