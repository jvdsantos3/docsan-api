import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { CreateDocumentTypeUseCase } from './create-document-type'
import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-document-types-repository copy'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let sut: CreateDocumentTypeUseCase

describe('Create a document type', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository(
      inMemoryDocumentsRepository,
    )
    inMemoryOwnersRepository = new InMemoryOwnersRepository(
      inMemoryCompaniesRepository,
    )

    sut = new CreateDocumentTypeUseCase(
      inMemoryDocumentTypesRepository,
      inMemoryOwnersRepository,
    )
  })

  it('should be able to create a new document type', async () => {
    const company = await inMemoryCompaniesRepository.create({
      name: 'Teste Company LTDA',
      tradeName: 'Teste Company',
      cnpj: '77.488.944/0001-84',
      cnae: '112233',
      addressId: randomUUID(),
    })

    const owner = await inMemoryOwnersRepository.create({
      name: 'Owner Teste',
      cpf: '19413695024',
      phone: '56696181610',
      email: 'teste@teste.com',
      password: '112233',
      companyId: company.id,
    })

    const result = await sut.execute({
      user: {
        sub: owner.id,
        role: 'OWNER',
      },
      name: 'Teste',
      fields: [{ name: 'Data de vencimento', type: 'Date', required: true }],
    })

    expect(result.documentType).toBeTruthy()
    expect(inMemoryDocumentTypesRepository.items[0].companyId).toEqual(
      company.id,
    )
  })
})
