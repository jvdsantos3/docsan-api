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
import { ChangeDocumentTypeActiveUseCase } from '@/use-cases/change-document-type-active'
import { ChangeDocumentTypeActiveController } from './controllers/change-document-type-active.controller'
import { DeleteDocumentTypeUseCase } from '@/use-cases/delete-document-type'
import { DeleteDocumentTypeController } from './controllers/delete-document-type.controller'
import { GetDocumentTypeByIdUseCase } from '@/use-cases/get-document-type-by-id'
import { GetDocumentTypeByIdController } from './controllers/get-document-type-by-id.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    CreateCompanyController,
    AuthenticateController,
    CreateDocumentTypeController,
    FetchDocumentTypesController,
    ChangeDocumentTypeActiveController,
    DeleteDocumentTypeController,
    GetDocumentTypeByIdController,
  ],
  providers: [
    DocumentService,
    RegisterCompanyUseCase,
    AuthenticateUseCase,
    CreateDocumentTypeUseCase,
    FetchDocumentTypesUseCase,
    ChangeDocumentTypeActiveUseCase,
    DeleteDocumentTypeUseCase,
    GetDocumentTypeByIdUseCase,
  ],
})
export class HttpModule {}
