import { HashGenerator } from '@/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { Professional } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AddressesRepository } from '@/database/repositories/addresses-repository'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { UsersRepository } from '@/database/repositories/users-repository'

interface RegisterProfessionalUseCaseRequest {
  name: string
  cpf: string
  birthDate: Date
  email: string
  password: string
  phone: string
  branchActivityId: string
  registryTypeId: string
  registry: string
  registryUf: string
  cnaeId: string
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
    private usersRepository: UsersRepository,
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
    branchActivityId,
    registryTypeId,
    registry,
    registryUf,
    cnaeId,
    zipCode,
    uf,
    city,
    street,
    number,
    neighborhood,
    complement,
  }: RegisterProfessionalUseCaseRequest): Promise<RegisterProfessionalUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
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

      const user = await this.usersRepository.create({
        email: email,
        password: hashedPassword,
        role: 'PROFESSIONAL',
      })

      const professional = await this.professionalsRepository.create(
        {
          addressId: address.id,
          userId: user.id,
          name,
          cpf,
          birthDate,
          phone,
          branchActivityId,
          registryTypeId,
          registry,
          registryUf,
          cnaeId,
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
