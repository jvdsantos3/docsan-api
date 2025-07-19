import { PrismaService } from '@/database/prisma.service'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { InMemoryProfessionalsRepository } from 'test/repositories/in-memory-professionals-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { randomUUID } from 'node:crypto'
import { RegisterProfessionalUseCase } from './register-professional'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository
let fakeHasher: FakeHasher
let prisma: PrismaService
let sut: RegisterProfessionalUseCase

describe('Register Professional', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOwnersRepository = new InMemoryOwnersRepository(
      inMemoryCompaniesRepository,
    )
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository()
    fakeHasher = new FakeHasher()
    prisma = new PrismaService()

    sut = new RegisterProfessionalUseCase(
      inMemoryAddressRepository,
      inMemoryOwnersRepository,
      inMemoryProfessionalsRepository,
      fakeHasher,
      prisma,
    )
  })

  it('should be able to register a new professional', async () => {
    const result = await sut.execute({
      name: 'Teste Company LTDA',
      cpf: '19413695024',
      birthDate: new Date('2002-01-02'),
      email: 'teste@professional.com',
      password: '112233',
      phone: '85986744016',
      fieldActivity: 'Desenvolvedor de software',
      registry: '1122334455',
      registryUf: 'CE',
      cnae: '112233',
      zipCode: '14403415',
      uf: 'SP',
      city: 'Franca',
      street: 'Rua Doutor José Carvalho Rosa',
      number: '524',
      neighborhood: 'São José',
      complement: 'Apto 101',
    })

    expect(result.professional).toBeTruthy()
    expect(inMemoryAddressRepository.items[0].id).toEqual(
      result.professional.addressId,
    )
  })

  it('should hash owner password upon registration', async () => {
    const result = await sut.execute({
      name: 'Teste Company LTDA',
      cpf: '19413695024',
      birthDate: new Date('2002-01-02'),
      email: 'teste@professional.com',
      password: '112233',
      phone: '85986744016',
      fieldActivity: 'Desenvolvedor de software',
      registry: '1122334455',
      registryUf: 'CE',
      cnae: '112233',
      zipCode: '14403415',
      uf: 'SP',
      city: 'Franca',
      street: 'Rua Doutor José Carvalho Rosa',
      number: '524',
      neighborhood: 'São José',
      complement: 'Apto 101',
    })

    const hashedPassword = await fakeHasher.hash('112233')

    expect(result.professional).toBeTruthy()
    expect(inMemoryProfessionalsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to register a professional with same email twice', async () => {
    const email = 'teste@professional.com'

    await sut.execute({
      name: 'Teste Company LTDA',
      cpf: '19413695024',
      birthDate: new Date('2002-01-02'),
      email,
      password: '112233',
      phone: '85986744016',
      fieldActivity: 'Desenvolvedor de software',
      registry: '1122334455',
      registryUf: 'CE',
      cnae: '112233',
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
        cpf: '19413695024',
        birthDate: new Date('2002-01-02'),
        email,
        password: '112233',
        phone: '85986744016',
        fieldActivity: 'Desenvolvedor de software',
        registry: '1122334455',
        registryUf: 'CE',
        cnae: '112233',
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

  it('should not be able to register a professional with same cpf twice', async () => {
    const cpf = '19413695024'

    await sut.execute({
      name: 'Teste Company LTDA',
      cpf,
      birthDate: new Date('2002-01-02'),
      email: 'teste@professional.com',
      password: '112233',
      phone: '85986744016',
      fieldActivity: 'Desenvolvedor de software',
      registry: '1122334455',
      registryUf: 'CE',
      cnae: '112233',
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
        cpf,
        birthDate: new Date('2002-01-02'),
        email: 'teste2@professional.com',
        password: '112233',
        phone: '85986744016',
        fieldActivity: 'Desenvolvedor de software',
        registry: '1122334455',
        registryUf: 'CE',
        cnae: '112233',
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

  it('should not be possible to register a professional with the same email as a owner', async () => {
    const email = 'teste@professional.com'

    inMemoryOwnersRepository.items.push({
      id: randomUUID(),
      name: 'Teste',
      cpf: '64979987052',
      email: email,
      password: '112233',
      phone: '56696181610',
      companyId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await expect(() =>
      sut.execute({
        name: 'Teste Company LTDA',
        cpf: '19413695024',
        birthDate: new Date('2002-01-02'),
        email,
        password: '112233',
        phone: '85986744016',
        fieldActivity: 'Desenvolvedor de software',
        registry: '1122334455',
        registryUf: 'CE',
        cnae: '112233',
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
