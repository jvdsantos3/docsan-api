import { CryptographyModule } from '@/cryptography/cryptography.module'
import { DatabaseModule } from '@/database/database.module'
import { RegisterCompanyUseCase } from '@/use-cases/register-company'
import { Module } from '@nestjs/common'
import { CreateCompanyController } from './controllers/create-company.controller'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { AuthenticateController } from './controllers/authenticate.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [CreateCompanyController, AuthenticateController],
  providers: [RegisterCompanyUseCase, AuthenticateUseCase],
})
export class HttpModule {}
