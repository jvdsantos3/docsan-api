import { InMemoryProfessionalsRepository } from 'test/repositories/in-memory-professionals-repository'
import { InMemoryServicesRepository } from 'test/repositories/in-memory-services-repository'
import { makeService } from 'test/factories/make-service'
import { FetchRecentServicesUseCase } from './fetch-recent-services'
import { makeProfessional } from 'test/factories/make-professional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository
let inMemoryServicesRepository: InMemoryServicesRepository
let sut: FetchRecentServicesUseCase

describe('Fetch Recent Services', () => {
  beforeEach(() => {
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository()
    inMemoryServicesRepository = new InMemoryServicesRepository(
      inMemoryProfessionalsRepository,
    )
    sut = new FetchRecentServicesUseCase(inMemoryServicesRepository)
  })

  it('should be able to fetch recent services', async () => {
    const prefessional1 = makeProfessional(
      {},
      new UniqueEntityID('professional-1'),
    )
    const prefessional2 = makeProfessional(
      {},
      new UniqueEntityID('professional-2'),
    )
    const prefessional3 = makeProfessional(
      {
        name: 'Professional 3',
      },
      new UniqueEntityID('professional-3'),
    )

    await inMemoryProfessionalsRepository.create(prefessional1)
    await inMemoryProfessionalsRepository.create(prefessional2)
    await inMemoryProfessionalsRepository.create(prefessional3)

    await inMemoryServicesRepository.create(
      makeService({
        createdAt: new Date(2025, 5, 20),
        professionalId: prefessional1.id,
      }),
    )
    await inMemoryServicesRepository.create(
      makeService({
        createdAt: new Date(2025, 5, 18),
        professionalId: prefessional2.id,
      }),
    )
    await inMemoryServicesRepository.create(
      makeService({
        createdAt: new Date(2025, 5, 23),
        professionalId: prefessional3.id,
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.services[0].professional).toMatchObject({
      name: 'Professional 3',
    })
    expect(result.value?.services).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 5, 23) }),
      expect.objectContaining({ createdAt: new Date(2025, 5, 20) }),
      expect.objectContaining({ createdAt: new Date(2025, 5, 18) }),
    ])
  })

  it('should be able to fetch paginated recent services', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryServicesRepository.create(makeService())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.services).toHaveLength(2)
  })
})
