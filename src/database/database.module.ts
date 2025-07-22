import { OwnersRepository } from '@/database/repositories/owners-repository'
import { CompaniesRepository } from './repositories/companies-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaCompaniesRepository } from './repositories/prisma/prisma-companies-repository'
import { AddressesRepository } from './repositories/addresses-repository'
import { PrismaAddressesRepository } from './repositories/prisma/prisma-addresses-repository'
import { ProfessionalsRepository } from './repositories/professionals-repository'
import { PrismaProfessionalsRepository } from './repositories/prisma/prisma-professionals-repository'
import { PrismaOwnersRepository } from './repositories/prisma/prisma-owners-repository'
import { DocumentTypesRepository } from './repositories/document-types-repository'
import { PrismaDocumentTypesRepository } from './repositories/prisma/prisma-document-types-repository'
import { DocumentsRepository } from './repositories/documents-repository'
import { PrismaDocumentsRepository } from './repositories/prisma/prisma-documents-repository'
import { IndexationsRepository } from './repositories/indexations-repository'
import { PrismaIndexationsRepository } from './repositories/prisma/prisma-indexations-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AddressesRepository,
      useClass: PrismaAddressesRepository,
    },
    {
      provide: OwnersRepository,
      useClass: PrismaOwnersRepository,
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
    {
      provide: ProfessionalsRepository,
      useClass: PrismaProfessionalsRepository,
    },
    {
      provide: DocumentTypesRepository,
      useClass: PrismaDocumentTypesRepository,
    },
    {
      provide: DocumentsRepository,
      useClass: PrismaDocumentsRepository,
    },
    {
      provide: IndexationsRepository,
      useClass: PrismaIndexationsRepository,
    },
  ],
  exports: [
    PrismaService,
    AddressesRepository,
    OwnersRepository,
    CompaniesRepository,
    ProfessionalsRepository,
    DocumentTypesRepository,
    DocumentsRepository,
    IndexationsRepository,
  ],
})
export class DatabaseModule {}
