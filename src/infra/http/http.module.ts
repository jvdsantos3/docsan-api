import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { CreateProfessionalController } from './controllers/create-professional.controller'
import { RegisterProfessionalUseCase } from '@/domain/application/use-cases/register-professional'
import { DatabaseModule } from '../database/database.module'
import { CreateCompanyController } from './controllers/create-company.controller'
import { RegisterCompanyUseCase } from '@/domain/application/use-cases/register-company'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [CreateProfessionalController, CreateCompanyController],
  providers: [RegisterProfessionalUseCase, RegisterCompanyUseCase],
})
export class HttpModule {}
