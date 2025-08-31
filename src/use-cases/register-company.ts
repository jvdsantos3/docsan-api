import { HashGenerator } from '@/cryptography/hash-generator'
import { CompaniesRepository } from '@/database/repositories/companies-repository'
import { Injectable } from '@nestjs/common'
import { Company } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AddressesRepository } from '@/database/repositories/addresses-repository'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { PrismaService } from '@/database/prisma.service'
import { UsersRepository } from '@/database/repositories/users-repository'
import { CnaesRepository } from '@/database/repositories/cnaes-repository'
import { CnaeNotFoundError } from './errors/cnae-not-found-error'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'
import { Queue } from 'bull'
import { EnvService } from '@/env/env.service'

interface RegisterCompanyUseCaseRequest {
  name: string
  tradeName: string
  cnpj: string
  cnaeId: string
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
    private env: EnvService,
    private addressRepository: AddressesRepository,
    private companiesRepository: CompaniesRepository,
    private usersRepository: UsersRepository,
    private ownersRepository: OwnersRepository,
    private cnaesRepository: CnaesRepository,
    private hashGenerator: HashGenerator,
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.MAILS) private mailQueue: Queue,
  ) {}

  async execute({
    name,
    tradeName,
    cnpj,
    cnaeId,
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

    const cnae = await this.cnaesRepository.findById(cnaeId)

    if (!cnae) {
      throw new CnaeNotFoundError()
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const { user, company } = await this.prisma.$transaction(async (prisma) => {
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
          cnaeId,
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

      return {
        user,
        company,
      }
    })

    const actionLink = `${this.env.get('CLIENT_URL')}/sign-in`

    await this.mailQueue.add(
      'send-email',
      {
        to: user.email,
        subject: 'Cadastro concluído.',
        template: 'company-registered',
        context: {
          name: company.name,
          actionLink,
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
      company,
    }
  }
}
