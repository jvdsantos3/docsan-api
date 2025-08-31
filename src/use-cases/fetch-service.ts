import { ServicesRepository } from '@/database/repositories/services-repository'
import { PaginationResponse } from '../database/interfaces/pagination-params'
import { Injectable } from '@nestjs/common'
import { Service } from '@prisma/client'
import { Uploader } from '@/storage/upload'

interface FetchServiceUseCaseRequest {
  page: number
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: 'name' | 'isActive' | 'isHighlighted' | 'createdAt'
  status?: boolean
  highlight?: boolean
  filter?: string
}

interface ImageInfo {
  name: string
  size: number
  type: string
  base64: string
}

interface FetchServiceUseCaseResponse {
  services: PaginationResponse<Service & { image: ImageInfo | null }>
}

@Injectable()
export class FetchServiceUseCase {
  constructor(
    private servicesRepository: ServicesRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    page,
    limit,
    order,
    orderBy,
    status,
    highlight,
    filter,
  }: FetchServiceUseCaseRequest): Promise<FetchServiceUseCaseResponse> {
    const services = await this.servicesRepository.fetchPagination({
      page,
      limit,
      order,
      orderBy,
      status,
      highlight,
      filter,
    })

    const servicesWithImageInfo = await Promise.all(
      services.data.map(async (service) => {
        let image: ImageInfo | null = null

        if (service.imageUrl) {
          try {
            const { body } = await this.uploader.get(service.imageUrl)
            
            const fileName = service.imageUrl.split('/').pop() || ''
            const lastDotIndex = fileName.lastIndexOf('.')
            const fileExtension = lastDotIndex > -1 ? fileName.substring(lastDotIndex + 1) : ''
            const nameWithoutExtension = lastDotIndex > -1 ? fileName.substring(0, lastDotIndex) : fileName
            
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i
            const originalName = nameWithoutExtension.replace(uuidPattern, '')
            
            image = {
              name: originalName,
              size: body.length,
              type: fileExtension,
              base64: body.toString('base64')
            }
          } catch (error) {
            console.warn(
              `Erro ao carregar imagem do serviço ${service.id}:`,
              error,
            )
          }
        }

        return {
          ...service,
          image,
        }
      }),
    )

    return {
      services: {
        ...services,
        data: servicesWithImageInfo,
      },
    }
  }
}
