import { HashGenerator } from '@/cryptography/hash-generator'
import { CompaniesRepository } from '@/database/repositories/companies-repository'
import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AddressesRepository } from '@/database/repositories/addresses-repository'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { PrismaService } from '@/database/prisma.service'
import { UsersRepository } from '@/database/repositories/users-repository'

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
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private ownersRepository: OwnersRepository,
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
    const userWithSameEmail = await this.usersRepository.findByEmail(ownerEmail)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError(ownerEmail)
    }

    const ownerWithSameCpf = await this.ownersRepository.findByCpf(ownerCpf)

    if (ownerWithSameCpf) {
      throw new UserAlreadyExistsError()
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

      const company = await this.companiesRepository.create(
        {
          name,
          tradeName,
          cnpj,
          cnae,
          addressId: address.id,
        },
        prisma,
      )

      const user = await this.usersRepository.create({
        email: ownerEmail,
        password: hashedPassword,
        role: 'OWNER',
      })

      await this.ownersRepository.create(
        {
          companyId: company.id,
          userId: user.id,
          name: ownerName,
          cpf: ownerCpf,
          phone: phone,
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
