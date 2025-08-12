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
import { CreateProfessionalController } from './controllers/professionals/create-professional.controller'
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
import { CreateRegistryTypeController } from './controllers/registry-type/create-registry-type.controller'
import { CreateRegistryTypeUseCase } from '@/use-cases/create-registry-type'
import { FetchCnaesController } from './controllers/cnae/fetch-cnaes.controller'
import { FetchCnaesUseCase } from '@/use-cases/fetch-cnaes'
import { CreateCnaeUseCase } from '@/use-cases/create-cnae'
import { CreateCnaeController } from './controllers/cnae/create-cnae.controller'
import { GetCnaeByIdUseCase } from '@/use-cases/get-cnae-by-id'
import { GetCnaeController } from './controllers/cnae/get-cnae.controller'
import { EditCnaeController } from './controllers/cnae/edit-cnae.controller'
import { EditCnaeUseCase } from '@/use-cases/edit-cnae'
import { DeleteCnaeController } from './controllers/cnae/delete-cnae.controller'
import { DeleteCnaeUseCase } from '@/use-cases/delete-cnae'
import { CreateBranchActivityController } from './controllers/branch-activity/create-branch-activity.controller'
import { CreateBranchActivityUseCase } from '@/use-cases/create-branch-activity'
import { FetchBranchesActivityController } from './controllers/branch-activity/fetch-branch-activities.controller'
import { FetchBranchesActivityUseCase } from '@/use-cases/fetch-branches-activity'
import { GetBranchActivitController } from './controllers/branch-activity/get-branch-activity.controller'
import { GetBranchActivitByIdUseCase } from '@/use-cases/get-branch-activity-by-id'
import { EditBranchActivityController } from './controllers/branch-activity/edit-branch-activity.controller'
import { EditBranchActivityUseCase } from '@/use-cases/edit-branch-activity'
import { DeleteBranchActivityUseCase } from '@/use-cases/delete-branch-activity'
import { DeleteBranchActivityController } from './controllers/branch-activity/delete-branch-activity.controller'
import { ChangeCnaeActiveController } from './controllers/cnae/change-cnae-active.controller'
import { ChangeCnaeActiveUseCase } from '@/use-cases/change-cnae-active'
import { ChangeBranchActivityActiveUseCase } from '@/use-cases/change-branch-activity-active'
import { ChangeBranchActivityActiveController } from './controllers/branch-activity/change-branch-activity-active.controller'
import { ChangeRegistryTypeActiveController } from './controllers/registry-type/change-registry-type-active.controller'
import { ChangeRegistryTypeActiveUseCase } from '@/use-cases/change-registry-type-active'
import { GetRegistryTypeController } from './controllers/registry-type/get-registry-type.controller'
import { GetRegistryTypeUseCase } from '@/use-cases/get-registry-type-active'
import { FetchRegistryTypesUseCase } from '@/use-cases/fetch-registry-types'
import { FetchRegistryTypesController } from './controllers/registry-type/fetch-registry-types.controller'
import { EditRegistryTypeController } from './controllers/registry-type/edit-registry-type.controller'
import { EditRegistryTypeUseCase } from '@/use-cases/edit-registry-type'
import { DeleteRegistryTypeController } from './controllers/registry-type/delete-registry-type.controller'
import { DeleteRegistryTypeUseCase } from '@/use-cases/delete-registry-type'
import { LogoutController } from './controllers/auth/logout.controller'
import { FetchProfessionalsController } from './controllers/professionals/fetch-professionals.controller'
import { FetchProfessionalsUseCase } from '@/use-cases/fetch-professionals'
import { GetProfessionalssummaryController } from './controllers/professionals/get-professionals-summary.controller'
import { GetProfessionalsSummaryUseCase } from '@/use-cases/get-professionals-summary'

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
    LogoutController,
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
    CreateRegistryTypeController,
    ChangeRegistryTypeActiveController,
    GetRegistryTypeController,
    FetchRegistryTypesController,
    EditRegistryTypeController,
    DeleteRegistryTypeController,
    FetchCnaesController,
    GetCnaeController,
    ChangeCnaeActiveController,
    CreateCnaeController,
    EditCnaeController,
    DeleteCnaeController,
    FetchBranchesActivityController,
    GetBranchActivitController,
    ChangeBranchActivityActiveController,
    CreateBranchActivityController,
    EditBranchActivityController,
    DeleteBranchActivityController,
    FetchProfessionalsController,
    GetProfessionalssummaryController,
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
    CreateRegistryTypeUseCase,
    ChangeRegistryTypeActiveUseCase,
    GetRegistryTypeUseCase,
    FetchRegistryTypesUseCase,
    EditRegistryTypeUseCase,
    DeleteRegistryTypeUseCase,
    FetchCnaesUseCase,
    GetCnaeByIdUseCase,
    ChangeCnaeActiveUseCase,
    CreateCnaeUseCase,
    EditCnaeUseCase,
    DeleteCnaeUseCase,
    FetchBranchesActivityUseCase,
    GetBranchActivitByIdUseCase,
    ChangeBranchActivityActiveUseCase,
    CreateBranchActivityUseCase,
    EditBranchActivityUseCase,
    DeleteBranchActivityUseCase,
    FetchProfessionalsUseCase,
    GetProfessionalsSummaryUseCase,
  ],
})
export class HttpModule {}
