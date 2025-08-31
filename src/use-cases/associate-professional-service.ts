import { ConflictException, Injectable } from '@nestjs/common'
import { ProfessionalService, PaymentMethod } from '@prisma/client'
import { ProfessionalServicesRepository } from '@/database/repositories/professional-services-repository'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { ServicesRepository } from '@/database/repositories/services-repository'
import { ServiceNotFoundError } from './errors/service-not-found-error'
import { ProfessionalServiceAlreadyExistsError } from './errors/professional-service-already-exists-error'
import { UserPayload } from '@/auth/jwt.strategy'
import { UsersRepository } from '@/database/repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface AssociateProfessionalServiceUseCaseRequest {
  payload: UserPayload
  serviceId: string
  price: number
  paymentMethods: PaymentMethod[]
  maxInstallments?: number
}

interface AssociateProfessionalServiceUseCaseResponse {
  professionalService: ProfessionalService
}

@Injectable()
export class AssociateProfessionalServiceUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private professionalServicesRepository: ProfessionalServicesRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    payload,
    serviceId,
    price,
    paymentMethods,
    maxInstallments,
  }: AssociateProfessionalServiceUseCaseRequest): Promise<AssociateProfessionalServiceUseCaseResponse> {
    const user = await this.usersRepository.findById(payload.sub)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (!user.professional) {
      throw new ConflictException(
        'Somente profissionais podem associar-se a serviços.',
      )
    }

    const service = await this.servicesRepository.findById(serviceId)

    if (!service) {
      throw new ServiceNotFoundError()
    }

    const existingAssociation =
      await this.professionalServicesRepository.findByProfessionalAndService(
        user.professional.id,
        serviceId,
      )
    if (existingAssociation) {
      throw new ProfessionalServiceAlreadyExistsError()
    }

    const professionalService =
      await this.professionalServicesRepository.create({
        professionalId: user.professional.id,
        serviceId,
        price,
        paymentMethods,
        maxInstallments,
      })

    return {
      professionalService,
    }
  }
}
