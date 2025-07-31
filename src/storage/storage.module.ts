import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { Uploader } from './upload'
import { LocalStorage } from './local/local-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: LocalStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
