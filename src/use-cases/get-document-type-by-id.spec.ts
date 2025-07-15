import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-document-types-repository copy'
import { GetDocumentTypeByIdUseCase } from './get-document-type-by-id'

let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: GetDocumentTypeByIdUseCase

describe('Get document type by id', () => {
  beforeEach(() => {
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository(
      inMemoryDocumentsRepository,
    )

    sut = new GetDocumentTypeByIdUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to get a document type by id', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: '[]',
      companyId: randomUUID(),
    })

    const result = await sut.execute({
      documentTypeId: type.id,
    })

    expect(result.documentType).toBeTruthy()
  })
})
