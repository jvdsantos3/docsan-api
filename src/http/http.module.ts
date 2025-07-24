import { CryptographyModule } from '@/cryptography/cryptography.module'
import { DatabaseModule } from '@/database/database.module'
import { RegisterCompanyUseCase } from '@/use-cases/register-company'
import { Module } from '@nestjs/common'
import { CreateCompanyController } from './controllers/create-company.controller'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { AuthenticateController } from './controllers/authenticate.controller'
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
import { EditDocumentTypeUseCase } from '@/use-cases/edit-document-type'
import { EditDocumentTypeController } from './controllers/edit-document-type.controller'
import { RegisterProfessionalUseCase } from '@/use-cases/register-professional'
import { CreateProfessionalController } from './controllers/create-professional.controller'
import { StorageModule } from '@/storage/storage.module'
import { ExtractDataController } from './controllers/extract-data.controller'
import { ExtractDataUseCase } from '@/use-cases/extract-data'
import { CreateDocumentUseCase } from '@/use-cases/create-document'
import { CreateDocumentController } from './controllers/create-document.controller'
import { CaslAbilityModule } from '@/casl/casl.module'
import { ProfileController } from './controllers/profile.controller'
import { GetProfileUseCase } from '@/use-cases/get-profile'
import { FetchDocumentsController } from './controllers/fetch-documents.controller'
import { FetchDocumentsUseCase } from '@/use-cases/fetch-documents'
import { GetDocumentsSummaryController } from './controllers/get-documents-summary.controller'
import { GetDocumentsSummaryUseCase } from '@/use-cases/get-documents-summary'
import { GetDocumentController } from './controllers/get-document.controller'
import { GetDocumentUseCase } from '@/use-cases/get-document'

@Module({
  imports: [
    CaslAbilityModule,
    CryptographyModule,
    DatabaseModule,
    StorageModule,
  ],
  controllers: [
    CreateCompanyController,
    CreateProfessionalController,
    AuthenticateController,
    ProfileController,
    CreateDocumentTypeController,
    FetchDocumentTypesController,
    ChangeDocumentTypeActiveController,
    DeleteDocumentTypeController,
    GetDocumentTypeByIdController,
    EditDocumentTypeController,
    ExtractDataController,
    CreateDocumentController,
    FetchDocumentsController,
    GetDocumentsSummaryController,
    GetDocumentController,
  ],
  providers: [
    RegisterCompanyUseCase,
    RegisterProfessionalUseCase,
    AuthenticateUseCase,
    GetProfileUseCase,
    CreateDocumentTypeUseCase,
    FetchDocumentTypesUseCase,
    ChangeDocumentTypeActiveUseCase,
    DeleteDocumentTypeUseCase,
    GetDocumentTypeByIdUseCase,
    EditDocumentTypeUseCase,
    ExtractDataUseCase,
    CreateDocumentUseCase,
    FetchDocumentsUseCase,
    GetDocumentsSummaryUseCase,
    GetDocumentUseCase,
  ],
})
export class HttpModule {}
