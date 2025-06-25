import { InMemoryProfessionalsRepository } from 'test/repositories/in-memory-professionals-repository'
import { CreateServiceUseCase } from './create-service'
import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'

let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository
let inMemoryServicesRepository: InMemoryServicesRepository
let sut: CreateServiceUseCase

describe('Create Service', () => {
  beforeEach(() => {
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository(
      inMemoryProfessionalsRepository,
    )
    sut = new CreateServiceUseCase(inMemoryServicesRepository)
  })

  it('should be able to create a service', async () => {
    const result = await sut.execute({
      professionalId: '1',
      title: 'Novo serviço',
      description: 'Descrição serviço',
      content: 'Conteúdo do serviço',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryServicesRepository.items[0]).toEqual(result.value?.service)
  })
})
