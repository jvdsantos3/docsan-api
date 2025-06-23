import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { ProfessionalAlreadyExistsError } from './errors/professional-already-exists-error'
import { Professional } from '@/domain/enterprise/entities/professional'
import { ProfessionalsRepository } from '../repositories/professionals-repository'

interface RegisterProfessionalUseCaseRequest {
  name: string
  cpf: string
  birthDate: Date
  email: string
  password: string
  phone: string
  fieldExpertise: string
  professionalRegistry: string
  registryUf: string
  cnae: string
  zipCode: string
  uf: string
  city: string
  street: string
  number: string
  neighborhood: string
  complement?: string
}

type RegisterProfessionalUseCaseResponse = Either<
  ProfessionalAlreadyExistsError,
  {
    professional: Professional
  }
>

@Injectable()
export class RegisterProfessionalUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    birthDate,
    email,
    password,
    phone,
    fieldExpertise,
    professionalRegistry,
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
    const professionalWithSameEmail =
      await this.professionalsRepository.findByEmail(email)

    if (professionalWithSameEmail) {
      return left(new ProfessionalAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const professional = Professional.create({
      name,
      cpf,
      birthDate,
      email,
      password: hashedPassword,
      phone,
      fieldExpertise,
      professionalRegistry,
      registryUf,
      cnae,
      zipCode,
      uf,
      city,
      street,
      number,
      neighborhood,
      complement,
    })

    await this.professionalsRepository.create(professional)

    return right({
      professional,
    })
  }
}
