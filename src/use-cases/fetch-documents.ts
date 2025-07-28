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
  status?: 'won' | 'near' | 'inDay'
  filter?: string
}

interface FetchDocumentsUseCaseResponse {
  documents: PaginationResponse<
    Prisma.DocumentGetPayload<{
      include: {
        documentType: true
      }
    }> & {
      status: 'inDay' | 'near' | 'won'
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
