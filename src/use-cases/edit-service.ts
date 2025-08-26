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
import { ServiceNotFoundError } from './errors/service-not-found-error'
import { ServiceHasProfessionalsError } from './errors/service-has-professionals-error'

interface EditServiceUseCaseRequest {
  serviceId: string
  payload: UserPayload
  name: string
  summary: string
  description: string
  fileName?: string
  fileType?: string
  body?: Buffer
}

interface EditServiceUseCaseResponse {
  service: Service
}

@Injectable()
export class EditServiceUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private servicesRepository: ServicesRepository,
    private uploader: Uploader,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    serviceId,
    payload,
    name,
    summary,
    description,
    fileName,
    fileType,
    body,
  }: EditServiceUseCaseRequest): Promise<EditServiceUseCaseResponse> {
    const user = await this.usersRepository.findById(payload.sub)

    if (!user) {
      throw new UserNotFoundError()
    }

    const serviceById = await this.servicesRepository.findById(serviceId)

    if (!serviceById) {
      throw new ServiceNotFoundError()
    }

    if (serviceById.name !== name) {
      const serviceWithSameName = await this.servicesRepository.findByName(name)

      if (serviceWithSameName) {
        throw new ServiceAlreadyExistsError(name)
      }
    }

    if (serviceById.professionals.length > 0) {
      throw new ServiceHasProfessionalsError()
    }

    const data: Partial<Prisma.ServiceUncheckedUpdateInput> & { id: string } = {
      id: serviceId,
      name,
      summary,
      description,
    }

    if (fileName && fileType && body) {
      if (serviceById.imageUrl) {
        await this.uploader.delete(serviceById.imageUrl)
      }

      const { url } = await this.uploader.upload({
        fileName: `services/images/${randomUUID()}-${fileName}`,
        fileType,
        body,
      })

      data.imageUrl = url
    }

    const service = await this.servicesRepository.save(data)

    this.eventEmitter.emit(
      'service.updated',
      new ServiceEvent(service.id, payload.sub),
    )

    return {
      service,
    }
  }
}
