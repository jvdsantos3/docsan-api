import { CompaniesRepository } from './repositories/companies-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaCompaniesRepository } from './repositories/prisma/prisma-companies-repository'
import { AddressesRepository } from './repositories/addresses-repository'
import { PrismaAddressesRepository } from './repositories/prisma/prisma-addresses-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AddressesRepository,
      useClass: PrismaAddressesRepository,
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
  ],
  exports: [PrismaService, AddressesRepository, CompaniesRepository],
})
export class DatabaseModule {}
