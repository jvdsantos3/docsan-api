import { RegisterCompanyUseCase } from './register-company'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let fakeHasher: FakeHasher
let sut: RegisterCompanyUseCase

describe('Register Company', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterCompanyUseCase(inMemoryCompaniesRepository, fakeHasher)
  })

  it('should be able to register a new company', async () => {
    const result = await sut.execute({
      name: 'Teste Company LTDA',
      tradeName: 'Teste Company',
      cnpj: '77.488.944/0001-84',
      email: 'teste@company.com',
      password: '112233',
      cnae: '112233',
      phone: '85986744016',
      responsibleName: 'Dono Teste',
      responsibleCpf: '03808164310',
      zipCode: '60181170',
      uf: 'CE',
      city: 'Fortaleza',
      street: 'Av. Areia Branca',
      number: '524',
      neighborhood: 'Vicente Pinzon',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      company: inMemoryCompaniesRepository.items[0],
    })
  })

  it('should hash company password upon registration', async () => {
    const result = await sut.execute({
      name: 'Teste Company LTDA',
      tradeName: 'Teste Company',
      cnpj: '77.488.944/0001-84',
      email: 'teste@company.com',
      password: '112233',
      cnae: '112233',
      phone: '85986744016',
      responsibleName: 'Dono Teste',
      responsibleCpf: '03808164310',
      zipCode: '60181170',
      uf: 'CE',
      city: 'Fortaleza',
      street: 'Av. Areia Branca',
      number: '524',
      neighborhood: 'Vicente Pinzon',
    })

    const hashedPassword = await fakeHasher.hash('112233')

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
