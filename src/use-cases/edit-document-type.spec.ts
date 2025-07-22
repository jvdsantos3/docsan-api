import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { EditDocumentTypeUseCase } from './edit-document-type'

let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: EditDocumentTypeUseCase

describe('Edit document type', () => {
  beforeEach(() => {
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository(
      inMemoryDocumentsRepository,
    )

    sut = new EditDocumentTypeUseCase(inMemoryDocumentTypesRepository)
  })

  it('should be able to edit a document type', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: [],
      companyId: randomUUID(),
    })

    const result = await sut.execute({
      documentTypeId: type.id,
      name: 'Teste 2',
      fields: [
        {
          name: 'Data de vencimento',
          type: 'Date',
          required: true,
        },
      ],
    })

    expect(result.documentType).toBeTruthy()
    expect(result.documentType.name).toEqual('Teste 2')
    expect(result.documentType.metadata).toEqual([
      expect.objectContaining({ name: 'Data de vencimento' }),
    ])
  })

  it('should not be able to edit the metadata of a document type with linked documents', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: [
        {
          name: 'Data de vencimento',
          type: 'Date',
          required: true,
        },
      ],
      companyId: randomUUID(),
    })

    await inMemoryDocumentsRepository.create({
      name: 'Document test',
      url: 'teste.pdf',
      version: 1,
      companyId: randomUUID(),
      documentTypeId: type.id,
    })

    await expect(() =>
      sut.execute({
        documentTypeId: type.id,
        name: 'Teste 2',
        fields: [
          {
            name: 'Data de vencimento',
            type: 'Date',
            required: true,
          },
          {
            name: 'Nome',
            type: 'String',
            required: false,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to edit the name of a document type with linked documents', async () => {
    const type = await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: [
        {
          name: 'Data de vencimento',
          type: 'Date',
          required: true,
        },
      ],
      companyId: randomUUID(),
    })

    await inMemoryDocumentsRepository.create({
      name: 'Document test',
      url: 'teste.pdf',
      version: 1,
      companyId: randomUUID(),
      documentTypeId: type.id,
    })

    const result = await sut.execute({
      documentTypeId: type.id,
      name: 'Teste 2',
      fields: [
        {
          name: 'Data de vencimento',
          type: 'Date',
          required: true,
        },
      ],
    })

    expect(result.documentType).toBeTruthy()
    expect(result.documentType.name).toEqual('Teste 2')
  })
})
