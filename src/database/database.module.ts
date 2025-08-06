import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { OwnersRepository } from '@/database/repositories/owners-repository'
import { CompaniesRepository } from './repositories/companies-repository'
import { AddressesRepository } from './repositories/addresses-repository'
import { ProfessionalsRepository } from './repositories/professionals-repository'
import { DocumentTypesRepository } from './repositories/document-types-repository'
import { DocumentsRepository } from './repositories/documents-repository'
import { IndexationsRepository } from './repositories/indexations-repository'
import { UsersRepository } from './repositories/users-repository'
import { DocumentNotificationsRepository } from './repositories/document-notifications-repository'
import { ChatHistoriesRepository } from './repositories/chat-histories-repository'

@Module({
  providers: [
    PrismaService,
    AddressesRepository,
    UsersRepository,
    OwnersRepository,
    CompaniesRepository,
    ProfessionalsRepository,
    DocumentTypesRepository,
    DocumentsRepository,
    IndexationsRepository,
    DocumentNotificationsRepository,
    ChatHistoriesRepository,
  ],
  exports: [
    PrismaService,
    AddressesRepository,
    UsersRepository,
    OwnersRepository,
    CompaniesRepository,
    ProfessionalsRepository,
    DocumentTypesRepository,
    DocumentsRepository,
    IndexationsRepository,
    DocumentNotificationsRepository,
    ChatHistoriesRepository,
  ],
})
export class DatabaseModule {}
