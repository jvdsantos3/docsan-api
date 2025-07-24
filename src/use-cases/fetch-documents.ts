import { PaginationResponse } from './../database/repositories/interfaces/pagination-params'
import { DocumentsRepository } from '@/database/repositories/documents-repository'
import { Injectable } from '@nestjs/common'
import { Document } from '@prisma/client'

interface FetchDocumentsUseCaseRequest {
  companyId: string
  page: number
  limit?: number
  order?: 'desc' | 'asc'
  orderBy?: string
  type?: string
  status?: 'won' | 'near' | 'inDay'
  filter?: string
}

type FetchDocumentsUseCaseResponse = PaginationResponse<Document>

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
    const documents = await this.documentsRepository.findMany({
      companyId,
      page,
      limit,
      order,
      orderBy,
      status,
      type,
      filter,
    })

    return documents
  }
}
