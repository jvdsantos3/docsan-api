import { ServicesRepository } from '@/database/repositories/services-repository'
import { PaginationResponse } from '../database/interfaces/pagination-params'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

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
  services: PaginationResponse<
    Prisma.ServiceGetPayload<{
      include: {
        professionals: {
          omit: {
            serviceId: true
            createdAt: true
            updatedAt: true
            professionalId: true
          }
          include: {
            professional: {
              omit: {
                createdAt: true
                updatedAt: true
              }
            }
          }
        }
      }
    }>
  >
}

@Injectable()
export class FetchServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

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

    return {
      services,
    }
  }
}
