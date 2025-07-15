import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { randomUUID } from 'node:crypto'
import { FetchDocumentTypesUseCase } from './fetch-document-types'

let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: FetchDocumentTypesUseCase

describe('Fetch document types', () => {
  beforeEach(() => {
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository()

    sut = new FetchDocumentTypesUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to fetch document types', async () => {
    for (let i = 1; i <= 3; i++) {
      await inMemoryDocumentTypesRepository.create({
        name: `Teste ${i}`,
        metadata: '[]',
        companyId: randomUUID(),
      })
    }

    const result = await sut.execute({
      page: 1,
    })

    expect(result.documentTypes).toEqual([
      expect.objectContaining({ name: 'Teste 1' }),
      expect.objectContaining({ name: 'Teste 2' }),
      expect.objectContaining({ name: 'Teste 3' }),
    ])
  })

  it('should be able to fetch paginated document types', async () => {
    for (let i = 1; i <= 12; i++) {
      await inMemoryDocumentTypesRepository.create({
        name: `Teste ${i}`,
        metadata: '[]',
        companyId: randomUUID(),
      })
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.documentTypes).toHaveLength(2)
  })
})
