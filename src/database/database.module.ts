import { CompaniesRepository } from './repositories/companies-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaCompaniesRepository } from './repositories/prisma/prisma-companies-repository'
import { AddressesRepository } from './repositories/addresses-repository'
import { PrismaAddressesRepository } from './repositories/prisma/prisma-addresses-repository'
import { OwnersRepository } from './repositories/owners-repository'
import { PrismaOwnersRepository } from './repositories/prisma/prisma-owners-repository'
import { ProfessionalsRepository } from './repositories/professionals-repository'
import { PrismaProfessionalsRepository } from './repositories/prisma/prisma-professionals-repository'

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
  ],
  exports: [
    PrismaService,
    AddressesRepository,
    OwnersRepository,
    CompaniesRepository,
    ProfessionalsRepository,
  ],
})
export class DatabaseModule {}
