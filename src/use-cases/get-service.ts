import { ServicesRepository } from '@/database/repositories/services-repository'
import { Injectable } from '@nestjs/common'
import { Service } from '@prisma/client'
import { ServiceNotFoundError } from './errors/service-not-found-error'
import { Uploader } from '@/storage/upload'

interface GetServiceUseCaseRequest {
  serviceId: string
}

interface ImageInfo {
  name: string
  size: number
  type: string
  base64: string
}

interface GetServiceUseCaseResponse {
  service: Service & { image: ImageInfo | null }
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

    let image: ImageInfo | null = null

    if (service.imageUrl) {
      try {
        const { body } = await this.uploader.get(service.imageUrl)

        const fileName = service.imageUrl.split('/').pop() || ''
        const lastDotIndex = fileName.lastIndexOf('.')
        const fileExtension =
          lastDotIndex > -1 ? fileName.substring(lastDotIndex + 1) : ''
        const nameWithoutExtension =
          lastDotIndex > -1 ? fileName.substring(0, lastDotIndex) : fileName

        const uuidPattern =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i
        const originalName = nameWithoutExtension.replace(uuidPattern, '')

        image = {
          name: originalName,
          size: body.length,
          type: fileExtension,
          base64: body.toString('base64'),
        }
      } catch (error) {
        console.warn(`Erro ao carregar imagem do serviço ${serviceId}:`, error)
      }
    }

    return {
      service: {
        ...service,
        image,
      },
    }
  }
}
