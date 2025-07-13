import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryProfessionalsRepository } from 'test/repositories/in-memory-professionals-repository'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { randomUUID } from 'node:crypto'

let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateUseCase

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryOwnersRepository = new InMemoryOwnersRepository()
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(
      inMemoryOwnersRepository,
      inMemoryProfessionalsRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate a company', async () => {
    inMemoryOwnersRepository.items.push({
      id: randomUUID(),
      name: 'Owner Teste',
      cpf: '19413695024',
      phone: '85986744016',
      email: 'teste@company.com',
      password: await fakeHasher.hash('123456'),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const { accessToken } = await sut.execute({
      email: 'teste@company.com',
      password: '123456',
    })

    expect(accessToken).toEqual(expect.any(String))
  })
})
