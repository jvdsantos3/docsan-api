import { ServicesRepository } from '@/database/repositories/services-repository'
import { PaginationResponse } from '../database/interfaces/pagination-params'
import { Injectable } from '@nestjs/common'
import { Service } from '@prisma/client'
import { Uploader } from '@/storage/upload'

interface FetchServiceUseCaseRequest {
  page: number
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: 'name' | 'isActive' | 'isHighlighted' | 'status' | 'createdAt'
  status?: boolean
  highlight?: boolean
  filter?: string
}

interface FetchServiceUseCaseResponse {
  services: PaginationResponse<Service & { imageBase64: string | null }>
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

    const servicesWithBase64 = await Promise.all(
      services.data.map(async (service) => {
        let imageBase64: string | null = null

        if (service.imageUrl) {
          try {
            const { body } = await this.uploader.get(service.imageUrl)

            imageBase64 = body.toString('base64')
          } catch (error) {
            console.warn(
              `Erro ao carregar imagem do serviço ${service.id}:`,
              error,
            )
          }
        }

        return {
          ...service,
          imageBase64,
        }
      }),
    )

    return {
      services: {
        ...services,
        data: servicesWithBase64,
      },
    }
  }
}
