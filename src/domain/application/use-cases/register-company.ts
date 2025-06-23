import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { CompanyAlreadyExistsError } from './errors/company-already-exists-error'
import { Company } from '@/domain/enterprise/entities/company'
import { CompaniesRepository } from '../repositories/companies-repository'

interface RegisterCompanyUseCaseRequest {
  name: string
  tradeName: string
  cnpj: string
  email: string
  password: string
  cnae: string
  phone: string
  responsibleName: string
  responsibleCpf: string
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  neighborhood: string
  complement?: string
}

type RegisterCompanyUseCaseResponse = Either<
  CompanyAlreadyExistsError,
  {
    company: Company
  }
>

@Injectable()
export class RegisterCompanyUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    tradeName,
    cnpj,
    email,
    password,
    cnae,
    phone,
    responsibleName,
    responsibleCpf,
    zipCode,
    uf,
    city,
    street,
    number,
    neighborhood,
    complement,
  }: RegisterCompanyUseCaseRequest): Promise<RegisterCompanyUseCaseResponse> {
    const companyWithSameEmail =
      await this.companiesRepository.findByEmail(email)

    if (companyWithSameEmail) {
      return left(new CompanyAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const company = Company.create({
      name,
      tradeName,
      cnpj,
      email,
      password: hashedPassword,
      cnae,
      phone,
      responsibleName,
      responsibleCpf,
      zipCode,
      uf,
      city,
      street,
      number,
      neighborhood,
      complement,
    })

    await this.companiesRepository.create(company)

    return right({
      company,
    })
  }
}
