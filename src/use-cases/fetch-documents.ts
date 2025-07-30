import { PaginationResponse } from '../database/interfaces/pagination-params'
import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

interface FetchDocumentsUseCaseRequest {
  companyId: string
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  orderBy?: 'name' | 'type' | 'status' | 'duedate' | 'createdAt'
  type?: string
  status?: 'overdue' | 'due_soon' | 'up_to_date'
  filter?: string
}

interface FetchDocumentsUseCaseResponse {
  documents: PaginationResponse<
    Prisma.DocumentGetPayload<{
      include: {
        documentType: true
      }
    }> & {
      status: 'up_to_date' | 'due_soon' | 'overdue'
    }
  >
}

@Injectable()
export class FetchDocumentsUseCase {
  constructor(private documentsRepository: DocumentsRepository) {}

  async execute({
    companyId,
    page,
    limit,
    order,
    orderBy,
    status,
    type,
    filter,
  }: FetchDocumentsUseCaseRequest): Promise<FetchDocumentsUseCaseResponse> {
    const documents = await this.documentsRepository.fetchPagination({
      companyId,
      page,
      limit,
      order,
      orderBy,
      status,
      type,
      filter,
    })

    return { documents }
  }
}
