import { PrismaService } from '@/database/prisma.service'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { RegisterCompanyUseCase } from './register-company'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let fakeHasher: FakeHasher
let prisma: PrismaService
let sut: RegisterCompanyUseCase

describe('Register Company', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOwnersRepository = new InMemoryOwnersRepository()
    fakeHasher = new FakeHasher()
    prisma = new PrismaService()

    sut = new RegisterCompanyUseCase(
      inMemoryAddressRepository,
      inMemoryOwnersRepository,
      inMemoryCompaniesRepository,
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
    expect(inMemoryAddressRepository.items[0].zipCode).toEqual('14403415')
    expect(inMemoryOwnersRepository.items[0].name).toEqual('Owner Teste')
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
})
