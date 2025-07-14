import { CryptographyModule } from '@/cryptography/cryptography.module'
import { DatabaseModule } from '@/database/database.module'
import { RegisterCompanyUseCase } from '@/use-cases/register-company'
import { Module } from '@nestjs/common'
import { CreateCompanyController } from './controllers/create-company.controller'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { AuthenticateController } from './controllers/authenticate.controller'
import { DocumentService } from '@/document/document.service'
import { CreateDocumentTypeUseCase } from '@/use-cases/create-document-type'
import { CreateDocumentTypeController } from './controllers/create-document-type.controller'
import { FetchDocumentTypesUseCase } from '@/use-cases/fetch-document-types'
import { FetchDocumentTypesController } from './controllers/fetch-document-types.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    CreateCompanyController,
    AuthenticateController,
    CreateDocumentTypeController,
    FetchDocumentTypesController,
  ],
  providers: [
    DocumentService,
    RegisterCompanyUseCase,
    AuthenticateUseCase,
    CreateDocumentTypeUseCase,
    FetchDocumentTypesUseCase,
  ],
})
export class HttpModule {}
