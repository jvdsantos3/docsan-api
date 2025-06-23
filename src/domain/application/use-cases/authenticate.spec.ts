import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryProfessionalsRepository } from 'test/repositories/in-memory-professionals-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { makeProfessional } from 'test/factories/make-professional'
import { makeCompany } from 'test/factories/make-company'

let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateUseCase

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository()
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(
      inMemoryProfessionalsRepository,
      inMemoryCompaniesRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a professional', async () => {
    const professional = makeProfessional({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryProfessionalsRepository.items.push(professional)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should be able to authenticate a company', async () => {
    const company = makeCompany({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
