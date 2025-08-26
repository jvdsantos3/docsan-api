import { ServicesRepository } from '@/database/repositories/services-repository'
import { Injectable } from '@nestjs/common'
import { Service } from '@prisma/client'
import { ServiceNotFoundError } from './errors/service-not-found-error'
import { Uploader } from '@/storage/upload'

interface GetServiceUseCaseRequest {
  serviceId: string
}

interface GetServiceUseCaseResponse {
  service: Service & { imageBase64: string | null }
}

@Injectable()
export class GetServiceUseCase {
  constructor(
    private servicesRepository: ServicesRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    serviceId,
  }: GetServiceUseCaseRequest): Promise<GetServiceUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      throw new ServiceNotFoundError()
    }

    let imageBase64: string | null = null

    if (service.imageUrl) {
      try {
        const { body } = await this.uploader.get(service.imageUrl)

        imageBase64 = body.toString('base64')
      } catch (error) {
        console.warn(`Erro ao carregar imagem do serviço ${serviceId}:`, error)
      }
    }

    return {
      service: {
        ...service,
        imageBase64,
      },
    }
  }
}
