import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { randomUUID } from 'node:crypto'
import { DeleteDocumentTypeUseCase } from './delete-document-type'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'

let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: DeleteDocumentTypeUseCase

describe('Delete document type', () => {
  beforeEach(() => {
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository(
      inMemoryDocumentsRepository,
    )

    sut = new DeleteDocumentTypeUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to delete a document type', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: '[]',
      companyId: randomUUID(),
    })

    await sut.execute({
      documentTypeId: type.id,
    })

    expect(inMemoryDocumentTypesRepository.items.length).toEqual(0)
  })

  it('should not be able to delete a document type with linked documents', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: '[]',
      companyId: randomUUID(),
    })

    await inMemoryDocumentsRepository.create({
      name: 'Document test',
      url: 'teste.pdf',
      companyId: randomUUID(),
      documentTypeId: type.id,
      indexationId: randomUUID(),
    })

    await expect(() =>
      sut.execute({
        documentTypeId: type.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
