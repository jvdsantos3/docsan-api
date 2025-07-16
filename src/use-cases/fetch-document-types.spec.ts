import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { randomUUID } from 'node:crypto'
import { FetchDocumentTypesUseCase } from './fetch-document-types'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'

let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: FetchDocumentTypesUseCase

describe('Fetch document types', () => {
  beforeEach(() => {
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository(
      inMemoryDocumentsRepository,
    )

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

    expect(result.data).toEqual([
      expect.objectContaining({ name: 'Teste 1' }),
      expect.objectContaining({ name: 'Teste 2' }),
      expect.objectContaining({ name: 'Teste 3' }),
    ])
  })

  it('should be able to fetch paginated document types', async () => {
    for (let i = 1; i <= 17; i++) {
      await inMemoryDocumentTypesRepository.create({
        name: `Teste ${i}`,
        metadata: '[]',
        companyId: randomUUID(),
      })
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.data).toHaveLength(2)
  })
})
