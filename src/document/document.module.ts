import { Module } from '@nestjs/common'
import { DocumentService } from './document.service'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { DocumentController } from './document.controller'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './tmp',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`
          cb(null, uniqueName)
        },
      }),
    }),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
