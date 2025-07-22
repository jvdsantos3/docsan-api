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

@Module({
  imports: [CryptographyModule, DatabaseModule, StorageModule],
  controllers: [
    CreateCompanyController,
    CreateProfessionalController,
    AuthenticateController,
    CreateDocumentTypeController,
    FetchDocumentTypesController,
    ChangeDocumentTypeActiveController,
    DeleteDocumentTypeController,
    GetDocumentTypeByIdController,
    EditDocumentTypeController,
    ExtractDataController,
    CreateDocumentController,
  ],
  providers: [
    RegisterCompanyUseCase,
    RegisterProfessionalUseCase,
    AuthenticateUseCase,
    CreateDocumentTypeUseCase,
    FetchDocumentTypesUseCase,
    ChangeDocumentTypeActiveUseCase,
    DeleteDocumentTypeUseCase,
    GetDocumentTypeByIdUseCase,
    EditDocumentTypeUseCase,
    ExtractDataUseCase,
    CreateDocumentUseCase,
  ],
})
export class HttpModule {}
