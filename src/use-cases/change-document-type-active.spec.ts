import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { ChangeDocumentTypeActiveUseCase } from './change-document-type-active'
import { randomUUID } from 'node:crypto'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'

let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: ChangeDocumentTypeActiveUseCase

describe('Change document type active', () => {
  beforeEach(() => {
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository(
      inMemoryDocumentsRepository,
    )

    sut = new ChangeDocumentTypeActiveUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to change the active field to false for a document type', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: '[]',
      companyId: randomUUID(),
    })

    const result = await sut.execute({
      documentTypeId: type.id,
    })

    expect(result.documentType).toBeTruthy()
    expect(result.documentType.isActive).toEqual(false)
  })

  it('should be able to change the active field to true for a document type', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: '[]',
      isActive: false,
      companyId: randomUUID(),
    })

    const result = await sut.execute({
      documentTypeId: type.id,
    })

    expect(result.documentType).toBeTruthy()
    expect(result.documentType.isActive).toEqual(true)
  })
})
