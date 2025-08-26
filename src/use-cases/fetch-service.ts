import { ServicesRepository } from '@/database/repositories/services-repository'
import { PaginationResponse } from '../database/interfaces/pagination-params'
import { Injectable } from '@nestjs/common'
import { Service } from '@prisma/client'

interface FetchServiceUseCaseRequest {
  page: number
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: 'name' | 'isActive' | 'isHighlighted' | 'createdAt'
  status?: boolean
  highlight?: boolean
  filter?: string
}

interface FetchServiceUseCaseResponse {
  services: PaginationResponse<Service>
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
