import { HashGenerator } from '@/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { Cnae, Professional } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AddressesRepository } from '@/database/repositories/addresses-repository'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { UsersRepository } from '@/database/repositories/users-repository'
import { BranchesActivityRepository } from '@/database/repositories/branches-activity-repository'
import { CnaesRepository } from '@/database/repositories/cnaes-repository'
import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { BranchActivityNotFoundError } from './errors/branch-activity-not-found-error'
import { CnaeNotFoundError } from './errors/cnae-not-found-error'
import { RegistryTypeNotFoundError } from './errors/registry-type-not-found-error'
import { format, isBefore, isEqual, startOfDay } from 'date-fns'
import { ProfessionalRejectedError } from './errors/professional-rejected-error'

interface RegisterProfessionalUseCaseRequest {
  name: string
  cpf: string
  birthDate: Date
  email: string
  password: string
  phone: string
  classification: 'PERSON' | 'COMPANY'
  cnpj?: string
  branchActivityId: string
  registryTypeId: string
  registry: string
  registryUf: string
  cnaeId?: string
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
    private branchesActivityRepository: BranchesActivityRepository,
    private cnaesRepository: CnaesRepository,
    private registryTypesRepository: RegistryTypesRepository,
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
    classification,
    cnpj,
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
    const professionalWithSameCpf =
      await this.professionalsRepository.findByCpf(cpf)

    if (
      professionalWithSameCpf &&
      professionalWithSameCpf.status !== 'REJECTED'
    ) {
      throw new UserAlreadyExistsError()
    }

    if (
      professionalWithSameCpf &&
      professionalWithSameCpf.status === 'REJECTED'
    ) {
      const rejectedUntil = professionalWithSameCpf.rejectedUntil
        ? startOfDay(professionalWithSameCpf.rejectedUntil)
        : null

      if (rejectedUntil) {
        const today = startOfDay(new Date())

        if (isBefore(rejectedUntil, today) || isEqual(rejectedUntil, today)) {
          const updatedProfessional = await this.professionalsRepository.save({
            id: professionalWithSameCpf.id,
            status: 'PENDING',
            rejectedUntil: null,
          })

          return {
            professional: updatedProfessional,
          }
        }

        throw new ProfessionalRejectedError(format(rejectedUntil, 'dd/MM/yyyy'))
      }
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    if (cnpj) {
      const professionalWithSameCnpj =
        await this.professionalsRepository.findByCnpj(cnpj)

      if (professionalWithSameCnpj) {
        throw new UserAlreadyExistsError()
      }
    }

    const branchActivity =
      await this.branchesActivityRepository.findById(branchActivityId)

    if (!branchActivity) {
      throw new BranchActivityNotFoundError()
    }

    let cnae: Cnae | null = null

    if (cnaeId) {
      cnae = await this.cnaesRepository.findById(cnaeId)

      if (!cnae) {
        throw new CnaeNotFoundError()
      }
    }

    const registryType =
      await this.registryTypesRepository.findById(registryTypeId)

    if (!registryType) {
      throw new RegistryTypeNotFoundError()
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
          classification,
          cnpj,
          branchActivityId: branchActivity.id,
          registryTypeId: registryType.id,
          registry,
          registryUf,
          cnaeId: cnae ? cnae.id : null,
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
