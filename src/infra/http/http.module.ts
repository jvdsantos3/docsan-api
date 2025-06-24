import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateProfessionalController } from './controllers/create-professional.controller'
import { RegisterProfessionalUseCase } from '@/domain/application/use-cases/register-professional'
import { DatabaseModule } from '../database/database.module'
import { CreateCompanyController } from './controllers/create-company.controller'
import { RegisterCompanyUseCase } from '@/domain/application/use-cases/register-company'
import { AuthenticateUseCase } from '@/domain/application/use-cases/authenticate'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateServiceController } from './controllers/create-service.controller'
import { CreateServiceUseCase } from '@/domain/application/use-cases/create-service'
import { FetchRecentServicesController } from './controllers/fetch-recent-services.controller'
import { FetchRecentServicesUseCase } from '@/domain/application/use-cases/fetch-recent-services'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [
    CreateProfessionalController,
    CreateCompanyController,
    AuthenticateController,
    CreateServiceController,
    FetchRecentServicesController,
  ],
  providers: [
    RegisterProfessionalUseCase,
    RegisterCompanyUseCase,
    AuthenticateUseCase,
    CreateServiceUseCase,
    FetchRecentServicesUseCase,
  ],
})
export class HttpModule {}
