import { Service } from '@/domain/enterprise/entities/service'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class ServicesRepository {
  abstract findById(id: string): Promise<Service | null>
  abstract findBySlug(slug: string): Promise<Service | null>
  abstract findManyRecent(params: PaginationParams): Promise<Service[]>
  abstract findManyRecentWithProfessional(
    params: PaginationParams,
  ): Promise<Service[]>
  abstract create(service: Service): Promise<void>
}
