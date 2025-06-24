import { Service } from '@/domain/enterprise/entities/service'
import { ServicesRepository } from '../repositories/services-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchRecentServicesUseCaseRequest {
  page: number
}

type FetchRecentServicesUseCaseResponse = Either<
  null,
  {
    services: Service[]
  }
>

@Injectable()
export class FetchRecentServicesUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    page,
  }: FetchRecentServicesUseCaseRequest): Promise<FetchRecentServicesUseCaseResponse> {
    const services = await this.servicesRepository.findManyRecentWithProfessional({ page })

    return right({
      services,
    })
  }
}
