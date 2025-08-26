import { ServicesRepository } from '@/database/repositories/services-repository'
import { Injectable } from '@nestjs/common'
import { ServiceNotFoundError } from './errors/service-not-found-error'
import { Uploader } from '@/storage/upload'

interface DeleteServiceUseCaseRequest {
  serviceId: string
}

interface DeleteServiceUseCaseResponse {
  message: string
}

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    private servicesRepository: ServicesRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    serviceId,
  }: DeleteServiceUseCaseRequest): Promise<DeleteServiceUseCaseResponse> {
    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      throw new ServiceNotFoundError()
    }

    if (service.imageUrl) {
      try {
        await this.uploader.delete(service.imageUrl)
      } catch (error) {
        console.warn(`Erro ao deletar imagem do serviço ${serviceId}:`, error)
      }
    }

    await this.servicesRepository.delete(serviceId)

    return {
      message: 'Serviço deletado com sucesso.',
    }
  }
}
