import { CryptographyModule } from '@/cryptography/cryptography.module'
import { DatabaseModule } from '@/database/database.module'
import { RegisterCompanyUseCase } from '@/use-cases/register-company'
import { Module } from '@nestjs/common'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { AuthenticateController } from './controllers/auth/authenticate.controller'
import { CreateDocumentTypeUseCase } from '@/use-cases/create-document-type'
import { FetchDocumentTypesUseCase } from '@/use-cases/fetch-document-types'
import { ChangeDocumentTypeActiveUseCase } from '@/use-cases/change-document-type-active'
import { DeleteDocumentTypeUseCase } from '@/use-cases/delete-document-type'
import { GetDocumentTypeByIdUseCase } from '@/use-cases/get-document-type-by-id'
import { EditDocumentTypeUseCase } from '@/use-cases/edit-document-type'
import { RegisterProfessionalUseCase } from '@/use-cases/register-professional'
import { CreateProfessionalController } from './controllers/auth/create-professional.controller'
import { StorageModule } from '@/storage/storage.module'
import { ExtractDataController } from './controllers/document/extract-data.controller'
import { ExtractDataUseCase } from '@/use-cases/extract-data'
import { CreateDocumentUseCase } from '@/use-cases/create-document'
import { CreateDocumentController } from './controllers/document/create-document.controller'
import { CaslAbilityModule } from '@/casl/casl.module'
import { ProfileController } from './controllers/auth/profile.controller'
import { GetProfileUseCase } from '@/use-cases/get-profile'
import { FetchDocumentsController } from './controllers/document/fetch-documents.controller'
import { FetchDocumentsUseCase } from '@/use-cases/fetch-documents'
import { GetDocumentsSummaryController } from './controllers/document/get-documents-summary.controller'
import { GetDocumentsSummaryUseCase } from '@/use-cases/get-documents-summary'
import { GetDocumentController } from './controllers/document/get-document.controller'
import { GetDocumentUseCase } from '@/use-cases/get-document'
import { ExportDocumentController } from './controllers/document/export-document.controller'
import { ExportDocumentUseCase } from '@/use-cases/export-document'
import { CreateCompanyController } from './controllers/auth/create-company.controller'
import { RefreshController } from './controllers/auth/refresh.controller'
import { RefreshUseCase } from '@/use-cases/refresh'
import { CreateDocumentTypeController } from './controllers/document-type/create-document-type.controller'
import { FetchDocumentTypesController } from './controllers/document-type/fetch-document-types.controller'
import { ChangeDocumentTypeActiveController } from './controllers/document-type/change-document-type-active.controller'
import { DeleteDocumentTypeController } from './controllers/document-type/delete-document-type.controller'
import { GetDocumentTypeController } from './controllers/document-type/get-document-type.controller'
import { EditDocumentTypeController } from './controllers/document-type/edit-document-type.controller'

@Module({
  imports: [
    CaslAbilityModule,
    CryptographyModule,
    DatabaseModule,
    StorageModule,
  ],
  controllers: [
    // AUTH
    CreateCompanyController,
    CreateProfessionalController,
    AuthenticateController,
    RefreshController,
    ProfileController,

    // DOCUMENT TYPE
    CreateDocumentTypeController,
    FetchDocumentTypesController,
    ChangeDocumentTypeActiveController,
    DeleteDocumentTypeController,
    GetDocumentTypeController,
    EditDocumentTypeController,

    // DOCUMENT
    ExtractDataController,
    CreateDocumentController,
    FetchDocumentsController,
    GetDocumentsSummaryController,
    GetDocumentController,
    ExportDocumentController,
  ],
  providers: [
    // AUTH
    RegisterCompanyUseCase,
    RegisterProfessionalUseCase,
    AuthenticateUseCase,
    RefreshUseCase,
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
    ExportDocumentUseCase,
  ],
})
export class HttpModule {}
