import { HashGenerator } from '@/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { Professional } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AddressesRepository } from '@/database/repositories/addresses-repository'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'

interface RegisterProfessionalUseCaseRequest {
  name: string
  cpf: string
  birthDate: Date
  email: string
  password: string
  phone: string
  fieldActivity: string
  registry: string
  registryUf: string
  cnae: string
  // TODO
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  neighborhood: string
  complement?: string
}

interface RegisterProfessionalUseCaseResponse {
  professional: Professional
}

@Injectable()
export class RegisterProfessionalUseCase {
  constructor(
    private addressRepository: AddressesRepository,
    private ownersRepository: OwnersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private hashGenerator: HashGenerator,
    private prisma: PrismaService,
  ) {}

  async execute({
    name,
    cpf,
    birthDate,
    email,
    password,
    phone,
    fieldActivity,
    registry,
    registryUf,
    cnae,
    zipCode,
    uf,
    city,
    street,
    number,
    neighborhood,
    complement,
  }: RegisterProfessionalUseCaseRequest): Promise<RegisterProfessionalUseCaseResponse> {
    const ownerWithSameEmail = await this.ownersRepository.findByEmail(email)

    if (ownerWithSameEmail) {
      throw new UserAlreadyExistsError(email)
    }

    const professionalWithSameEmail =
      await this.professionalsRepository.findByEmail(email)

    if (professionalWithSameEmail) {
      throw new UserAlreadyExistsError(email)
    }

    const professionalWithSameCpf =
      await this.professionalsRepository.findByCpf(cpf)

    if (professionalWithSameCpf) {
      throw new UserAlreadyExistsError()
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const professional = await this.prisma.$transaction(async (prisma) => {
      const address = await this.addressRepository.create(
        {
          zipCode,
          uf,
          city,
          street,
          number,
          neighborhood,
          complement,
        },
        prisma,
      )

      const professional = await this.professionalsRepository.create(
        {
          name,
          cpf,
          birthDate,
          email,
          password: hashedPassword,
          phone,
          fieldActivity,
          registry,
          registryUf,
          cnae,
          addressId: address.id,
        },
        prisma,
      )

      return professional
    })

    return {
      professional,
    }
  }
}
