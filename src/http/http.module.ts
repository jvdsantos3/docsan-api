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
import { FetchDocumentsUseCase } from '@/use-cases/fetch-documents'
import { GetDocumentsSummaryUseCase } from '@/use-cases/get-documents-summary'
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
import { FetchDocumentsController } from './controllers/document/fetch-documents.controller'
import { GetDocumentsSummaryController } from './controllers/document/get-documents-summary.controller'
import { GetDocumentController } from './controllers/document/get-document.controller'
import { FetchDocumentTypeDocumentsController } from './controllers/document-type/fetch-document-type-documents.controller'
import { FetchDocumentTypeDocumentsUseCase } from '@/use-cases/fetch-document-type-documents'
import { CreateDocumentNotificationController } from './controllers/document/create-document-notification.controller'
import { CreateDocumentNotifictionUseCase } from '@/use-cases/create-document-notification'
import { GeminiModule } from '@/gemini/gemini.module'
import { SendQuestionController } from './controllers/chat/send-question.controller'
import { RedisService } from '@/redis/redis.service'
import { EnvService } from '@/env/env.service'
import { AnswerQuestionUseCase } from '@/use-cases/answer-question'
import { SendQuestionPrivateController } from './controllers/chat/send-question.controller-private'
import { GeminiService } from '@/gemini/gemini.service'

@Module({
  imports: [
    CaslAbilityModule,
    CryptographyModule,
    DatabaseModule,
    StorageModule,
    GeminiModule,
  ],
  controllers: [
    CreateCompanyController,
    CreateProfessionalController,
    AuthenticateController,
    RefreshController,
    ProfileController,
    CreateDocumentTypeController,
    FetchDocumentTypesController,
    ChangeDocumentTypeActiveController,
    DeleteDocumentTypeController,
    GetDocumentTypeController,
    EditDocumentTypeController,
    FetchDocumentTypeDocumentsController,
    ExtractDataController,
    CreateDocumentController,
    FetchDocumentsController,
    GetDocumentsSummaryController,
    GetDocumentController,
    ExportDocumentController,
    CreateDocumentNotificationController,
    SendQuestionController,
    SendQuestionPrivateController,
  ],
  providers: [
    EnvService,
    RedisService,
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
    FetchDocumentTypeDocumentsUseCase,
    ExtractDataUseCase,
    CreateDocumentUseCase,
    FetchDocumentsUseCase,
    GetDocumentsSummaryUseCase,
    GetDocumentUseCase,
    ExportDocumentUseCase,
    CreateDocumentNotifictionUseCase,
    AnswerQuestionUseCase,
  ],
})
export class HttpModule {}
