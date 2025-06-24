import { PaginationParams } from '@/core/repositories/pagination-params'
import { ProfessionalsRepository } from '@/domain/application/repositories/professionals-repository'
import { ServicesRepository } from '@/domain/application/repositories/services-repository'
import { Service } from '@/domain/enterprise/entities/service'

export class InMemoryServicesRepository implements ServicesRepository {
  public items: Service[] = []

  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async findById(id: string) {
    const service = this.items.find((item) => item.id.toString() === id)

    if (!service) {
      return null
    }

    return service
  }

  async findBySlug(slug: string) {
    const service = this.items.find((item) => item.slug.value === slug)

    if (!service) {
      return null
    }

    return service
  }

  async findManyRecent({ page }: PaginationParams) {
    const services = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return services
  }

  async findManyRecentWithProfessional({ page }: PaginationParams) {
    const services = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    const servicesWithProfessionals = await Promise.all(
      services.map(async (service) => {
        const professional = await this.professionalsRepository.findById(
          service.professionalId.toString(),
        )

        if (!professional) {
          return service
        }

        service.professional = professional

        return service
      }),
    )

    return servicesWithProfessionals
  }

  async create(service: Service) {
    this.items.push(service)
  }
}
