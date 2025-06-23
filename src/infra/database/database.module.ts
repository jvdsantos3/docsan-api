import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ProfessionalsRepository } from '@/domain/application/repositories/professionals-repository'
import { PrismaProfessionalsRepository } from './prisma/repositories/prisma-professionals-repository'
import { CompaniesRepository } from '@/domain/application/repositories/companies-repository'
import { PrismaCompaniesRepository } from './prisma/repositories/prisma-companies-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: ProfessionalsRepository,
      useClass: PrismaProfessionalsRepository,
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
  ],
  exports: [PrismaService, ProfessionalsRepository, CompaniesRepository],
})
export class DatabaseModule {}
