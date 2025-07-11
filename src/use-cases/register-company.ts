import { HashGenerator } from '@/cryptography/hash-generator'
import { CompaniesRepository } from '@/database/repositories/companies-repository'
import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { OwnerAlreadyExistsError } from './errors/owner-already-exists-error'
import { AddressesRepository } from '@/database/repositories/address-repository'
import { OwnersRepository } from '@/database/repositories/owners-repository'

interface RegisterCompanyUseCaseRequest {
  name: string
  tradeName: string
  cnpj: string
  cnae: string
  ownerName: string
  ownerCpf: string
  ownerEmail: string
  password: string
  email: string
  phone: string
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
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    tradeName,
    cnpj,
    cnae,
    ownerName,
    ownerCpf,
    ownerEmail,
    password,
    email,
    phone,
    zipCode,
    uf,
    city,
    street,
    number,
    neighborhood,
    complement,
  }: RegisterCompanyUseCaseRequest): Promise<RegisterCompanyUseCaseResponse> {
    const ownerWithSameEmail = await this.ownersRepository.findByEmail(email)

    if (ownerWithSameEmail) {
      throw new OwnerAlreadyExistsError(email)
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const address = await this.addressRepository.create({
      zipCode,
      uf,
      city,
      street,
      number,
      neighborhood,
      complement,
    })

    const owner = await this.ownersRepository.create({
      name: ownerName,
      cpf: ownerCpf,
      phone: phone,
      email: ownerEmail,
      password: hashedPassword,
    })

    const company = await this.companiesRepository.create({
      name,
      tradeName,
      cnpj,
      cnae,
      addressId: address.id,
      ownerId: owner.id,
    })

    return {
      company,
    }
  }
}
