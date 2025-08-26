import { Injectable } from '@nestjs/common'
import { ServicesRepository } from '@/database/repositories/services-repository'
import { ServiceNotFoundError } from './errors/service-not-found-error'

export interface ToggleServiceActiveUseCaseRequest {
  serviceId: string
}

@Injectable()
export class ToggleServiceActiveUseCase {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async execute({
    serviceId,
  }: ToggleServiceActiveUseCaseRequest): Promise<void> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      throw new ServiceNotFoundError()
    }

    await this.servicesRepository.save({
      id: serviceId,
      isActive: !service.isActive,
    })
  }
}
