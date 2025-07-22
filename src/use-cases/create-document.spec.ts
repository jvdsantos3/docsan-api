import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryOwnersRepository } from 'test/repositories/in-memory-owners-repository'
import { InMemoryDocumentTypesRepository } from 'test/repositories/in-memory-document-types-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { PrismaService } from '@/database/prisma.service'
import { CreateDocumentUseCase } from './create-document'
import { InMemoryIndexationsRepository } from 'test/repositories/in-memory-indexations-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryOwnersRepository: InMemoryOwnersRepository
let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryDocumentTypesRepository: InMemoryDocumentTypesRepository
let inMemoryIndexationsRepository: InMemoryIndexationsRepository
let prisma: PrismaService
let fakeUploader: FakeUploader

let sut: CreateDocumentUseCase

describe('Create a document', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryDocumentTypesRepository = new InMemoryDocumentTypesRepository(
      inMemoryDocumentsRepository,
    )
    inMemoryOwnersRepository = new InMemoryOwnersRepository(
      inMemoryCompaniesRepository,
    )
    inMemoryIndexationsRepository = new InMemoryIndexationsRepository()
    fakeUploader = new FakeUploader()
    prisma = new PrismaService()

    sut = new CreateDocumentUseCase(
      prisma,
      inMemoryOwnersRepository,
      inMemoryDocumentTypesRepository,
      inMemoryDocumentsRepository,
      inMemoryIndexationsRepository,
      fakeUploader,
    )
  })

  it('should be able to create a new document', async () => {
    const company = await inMemoryCompaniesRepository.create({
      name: 'Teste Company LTDA',
      tradeName: 'Teste Company',
      cnpj: '77.488.944/0001-84',
      cnae: '112233',
      addressId: randomUUID(),
    })

    await inMemoryOwnersRepository.create({
      name: 'Owner Teste',
      cpf: '19413695024',
      phone: '56696181610',
      email: 'teste@teste.com',
      password: '112233',
      companyId: company.id,
    })

    await inMemoryDocumentTypesRepository.create({
      name: 'Teste 1',
      metadata: [
        {
          name: 'Data de vencimento',
          type: 'date',
          required: true,
        },
      ],
      companyId: randomUUID(),
    })
  })
})
