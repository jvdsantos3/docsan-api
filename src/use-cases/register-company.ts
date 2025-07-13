import { HashGenerator } from '@/cryptography/hash-generator'
import { CompaniesRepository } from '@/database/repositories/companies-repository'
import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AddressesRepository } from '@/database/repositories/addresses-repository'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'

interface RegisterCompanyUseCaseRequest {
  name: string
  tradeName: string
  cnpj: string
  cnae: string
  ownerName: string
  ownerCpf: string
  phone: string
  ownerEmail: string
  password: string
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  neighborhood: string
  complement?: string
}

interface RegisterCompanyUseCaseResponse {
  company: Company
}

@Injectable()
export class RegisterCompanyUseCase {
  constructor(
    private addressRepository: AddressesRepository,
    private ownersRepository: OwnersRepository,
    private companiesRepository: CompaniesRepository,
    private professionalsRepository: ProfessionalsRepository,
    private hashGenerator: HashGenerator,
    private prisma: PrismaService,
  ) {}

  async execute({
    name,
    tradeName,
    cnpj,
    cnae,
    ownerName,
    ownerCpf,
    phone,
    ownerEmail,
    password,
    zipCode,
    uf,
    city,
    street,
    number,
    neighborhood,
    complement,
  }: RegisterCompanyUseCaseRequest): Promise<RegisterCompanyUseCaseResponse> {
    const ownerWithSameEmail =
      await this.ownersRepository.findByEmail(ownerEmail)

    if (ownerWithSameEmail) {
      throw new UserAlreadyExistsError(ownerEmail)
    }

    const professionalWithSameEmail =
      await this.professionalsRepository.findByEmail(ownerEmail)

    if (professionalWithSameEmail) {
      throw new UserAlreadyExistsError(ownerEmail)
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const company = await this.prisma.$transaction(async (prisma) => {
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

      const owner = await this.ownersRepository.create(
        {
          name: ownerName,
          cpf: ownerCpf,
          phone: phone,
          email: ownerEmail,
          password: hashedPassword,
        },
        prisma,
      )

      const company = await this.companiesRepository.create(
        {
          name,
          tradeName,
          cnpj,
          cnae,
          addressId: address.id,
          ownerId: owner.id,
        },
        prisma,
      )

      return company
    })

    return {
      company,
    }
  }
}
