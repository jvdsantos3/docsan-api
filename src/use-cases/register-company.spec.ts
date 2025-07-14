import { PrismaService } from '@/database/prisma.service'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { RegisterCompanyUseCase } from './register-company'
import { InMemoryProfessionalsRepository } from 'test/repositories/in-memory-professionals-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { randomUUID } from 'node:crypto'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository
let fakeHasher: FakeHasher
let prisma: PrismaService
let sut: RegisterCompanyUseCase

describe('Register Company', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOwnersRepository = new InMemoryOwnersRepository(
      inMemoryCompaniesRepository,
    )
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository()
    fakeHasher = new FakeHasher()
    prisma = new PrismaService()

    sut = new RegisterCompanyUseCase(
      inMemoryAddressRepository,
      inMemoryOwnersRepository,
      inMemoryCompaniesRepository,
      inMemoryProfessionalsRepository,
      fakeHasher,
      prisma,
    )
  })

  it('should be able to register a new company', async () => {
    const result = await sut.execute({
      name: 'Teste Company LTDA',
      tradeName: 'Teste Company',
      cnpj: '77.488.944/0001-84',
      cnae: '112233',
      ownerName: 'Owner Teste',
      ownerCpf: '19413695024',
      phone: '85986744016',
      ownerEmail: 'teste@company.com',
      password: '112233',
      zipCode: '14403415',
      uf: 'SP',
      city: 'Franca',
      street: 'Rua Doutor José Carvalho Rosa',
      number: '524',
      neighborhood: 'São José',
      complement: 'Apto 101',
    })

    expect(result.company).toBeTruthy()
    expect(inMemoryAddressRepository.items[0].id).toEqual(
      result.company.addressId,
    )
    expect(inMemoryOwnersRepository.items[0].companyId).toEqual(
      result.company.id,
    )
  })

  it('should hash owner password upon registration', async () => {
    const result = await sut.execute({
      name: 'Teste Company LTDA',
      tradeName: 'Teste Company',
      cnpj: '77.488.944/0001-84',
      cnae: '112233',
      ownerName: 'Owner Teste',
      ownerCpf: '19413695024',
      phone: '85986744016',
      ownerEmail: 'teste@company.com',
      password: '112233',
      zipCode: '14403415',
      uf: 'SP',
      city: 'Franca',
      street: 'Rua Doutor José Carvalho Rosa',
      number: '524',
      neighborhood: 'São José',
      complement: 'Apto 101',
    })

    const hashedPassword = await fakeHasher.hash('112233')

    expect(result.company).toBeTruthy()
    expect(inMemoryOwnersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register a company with same email twice', async () => {
    const email = 'teste@company.com'

    await sut.execute({
      name: 'Teste Company LTDA',
      tradeName: 'Teste Company',
      cnpj: '77.488.944/0001-84',
      cnae: '112233',
      ownerName: 'Owner Teste',
      ownerCpf: '19413695024',
      phone: '85986744016',
      ownerEmail: email,
      password: '112233',
      zipCode: '14403415',
      uf: 'SP',
      city: 'Franca',
      street: 'Rua Doutor José Carvalho Rosa',
      number: '524',
      neighborhood: 'São José',
      complement: 'Apto 101',
    })

    await expect(() =>
      sut.execute({
        name: 'Teste Company LTDA',
        tradeName: 'Teste Company',
        cnpj: '77.488.944/0001-84',
        cnae: '112233',
        ownerName: 'Owner Teste',
        ownerCpf: '19413695024',
        phone: '56696181610',
        ownerEmail: email,
        password: '112233',
        zipCode: '14403415',
        uf: 'SP',
        city: 'Franca',
        street: 'Rua Doutor José Carvalho Rosa',
        number: '524',
        neighborhood: 'São José',
        complement: 'Apto 101',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be possible to register a company with the same email as a professional', async () => {
    const email = 'teste@company.com'

    inMemoryProfessionalsRepository.items.push({
      id: randomUUID(),
      name: 'Teste',
      cpf: '64979987052',
      birthDate: new Date(),
      email: email,
      password: '112233',
      phone: '56696181610',
      fieldActivity: 'Desenvolvimento de Software',
      registry: '123456',
      registryUf: 'SP',
      cnae: '1234567',
      addressId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await expect(() =>
      sut.execute({
        name: 'Teste Company LTDA',
        tradeName: 'Teste Company',
        cnpj: '77.488.944/0001-84',
        cnae: '112233',
        ownerName: 'Owner Teste',
        ownerCpf: '19413695024',
        phone: '56696181610',
        ownerEmail: email,
        password: '112233',
        zipCode: '14403415',
        uf: 'SP',
        city: 'Franca',
        street: 'Rua Doutor José Carvalho Rosa',
        number: '524',
        neighborhood: 'São José',
        complement: 'Apto 101',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
