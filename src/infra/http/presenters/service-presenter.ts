import { Service } from '@/domain/enterprise/entities/service'

export class ServicePresenter {
  static toHTTP(service: Service) {
    return {
      id: service.id.toString(),
      title: service.title,
      slug: service.slug.value,
      content: service.content,
      professional: {
        id: service.professional?.id.toString(),
        name: service.professional?.name,
        fieldExpertise: service.professional?.fieldExpertise,
      },
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }
  }
}
