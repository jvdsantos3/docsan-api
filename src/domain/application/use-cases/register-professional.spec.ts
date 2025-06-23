import { RegisterProfessionalUseCase } from './register-professional'
import { InMemoryProfessionalsRepository } from 'test/repositories/in-memory-professionals-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository
let fakeHasher: FakeHasher
let sut: RegisterProfessionalUseCase

describe('Register Professional', () => {
  beforeEach(() => {
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterProfessionalUseCase(
      inMemoryProfessionalsRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new professional', async () => {
    const result = await sut.execute({
      name: 'João Vitor',
      cpf: '03808164310',
      birthDate: new Date('2002-01-02'),
      email: 'jvdsantos@teste.com',
      password: '112233',
      phone: '85986744016',
      fieldExpertise: 'Desenvolvimento de software',
      professionalRegistry: 'Desenvolvedor',
      registryUf: 'CE',
      cnae: '112233',
      zipCode: '60181170',
      uf: 'CE',
      city: 'Fortaleza',
      street: 'Av. Areia Branca',
      number: '524',
      neighborhood: 'Vicente Pinzon',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      professional: inMemoryProfessionalsRepository.items[0],
    })
  })

  it('should hash professional password upon registration', async () => {
    const result = await sut.execute({
      name: 'João Vitor',
      cpf: '03808164310',
      birthDate: new Date('2002-01-02'),
      email: 'jvdsantos@teste.com',
      password: '112233',
      phone: '85986744016',
      fieldExpertise: 'Desenvolvimento de software',
      professionalRegistry: 'Desenvolvedor',
      registryUf: 'CE',
      cnae: '112233',
      zipCode: '60181170',
      uf: 'CE',
      city: 'Fortaleza',
      street: 'Av. Areia Branca',
      number: '524',
      neighborhood: 'Vicente Pinzon',
    })

    const hashedPassword = await fakeHasher.hash('112233')

    expect(result.isRight()).toBe(true)
    expect(inMemoryProfessionalsRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
