import { CryptographyModule } from '@/cryptography/cryptography.module'
import { DatabaseModule } from '@/database/database.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [CryptographyModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
