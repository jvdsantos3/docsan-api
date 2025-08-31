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
import { BranchActivityNotFoundError } from './errors/branch-activity-not-found-error'
import { CnaeNotFoundError } from './errors/cnae-not-found-error'
import { RegistryTypeNotFoundError } from './errors/registry-type-not-found-error'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'
import { Queue } from 'bull'
import { RegistryTypesRepository } from '@/database/repositories/registry-types-repository'
import { EnvService } from '@/env/env.service'

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
    private env: EnvService,
    private addressRepository: AddressesRepository,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private branchesActivityRepository: BranchesActivityRepository,
    private cnaesRepository: CnaesRepository,
    private registryTypesRepository: RegistryTypesRepository,
    private hashGenerator: HashGenerator,
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.MAILS) private mailQueue: Queue,
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

    let cnae: Cnae | null = null

    if (cnaeId) {
      cnae = await this.cnaesRepository.findById(cnaeId)

      if (!cnae) {
        throw new CnaeNotFoundError()
      }
    }

    if (
      professionalWithSameCpf &&
      professionalWithSameCpf.status === 'REJECTED'
    ) {
      const updatedProfessional = await this.professionalsRepository.save({
        id: professionalWithSameCpf.id,
        status: 'PENDING',
        name,
        cpf,
        birthDate,
        phone,
        classification,
        cnpj,
        branchActivityId,
        registryTypeId,
        registry,
        registryUf,
        cnaeId: cnae ? cnae.id : null,
      })

      await this.addressRepository.save({
        id: professionalWithSameCpf.addressId,
        zipCode,
        uf,
        city,
        street,
        number,
        neighborhood,
        complement,
      })

      return {
        professional: updatedProfessional,
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

    const registryType =
      await this.registryTypesRepository.findById(registryTypeId)

    if (!registryType) {
      throw new RegistryTypeNotFoundError()
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const { user, professional } = await this.prisma.$transaction(
      async (prisma) => {
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

        return {
          user,
          professional,
        }
      },
    )

    const actionLink = `${this.env.get('CLIENT_URL')}`

    await this.mailQueue.add(
      'send-email',
      {
        to: user.email,
        subject: 'Cadastro em análise.',
        template: 'professional-pending',
        context: {
          name: professional.name,
          actionLink
        },
      },
      {
        delay: 3000,
        attempts: 3,
        backoff: {
          type: 'fixer',
          delay: 30000,
        },
      },
    )

    return {
      professional,
    }
  }
}
