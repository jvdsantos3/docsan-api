import { CryptographyModule } from '@/cryptography/cryptography.module'
import { DatabaseModule } from '@/database/database.module'
import { RegisterCompanyUseCase } from '@/use-cases/register-company'
import { Module } from '@nestjs/common'
import { CreateCompanyController } from './controllers/create-company.controller'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [CreateCompanyController],
  providers: [RegisterCompanyUseCase],
})
export class HttpModule {}
