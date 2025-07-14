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
  ],
  exports: [
    PrismaService,
    AddressesRepository,
    OwnersRepository,
    CompaniesRepository,
    ProfessionalsRepository,
    DocumentTypesRepository,
  ],
})
export class DatabaseModule {}
