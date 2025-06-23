import { Service } from '@/domain/enterprise/entities/service'
import { ServicesRepository } from '../repositories/services-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateServiceUseCaseRequest {
  professionalId: string
  title: string
  content: string
}

type CreateServiceUseCaseResponse = Either<
  null,
  {
    service: Service
  }
>

@Injectable()
export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    professionalId,
    title,
    content,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const service = Service.create({
      professionalId: new UniqueEntityID(professionalId),
      title,
      content,
    })

    await this.servicesRepository.create(service)

    return right({
      service,
    })
  }
}
