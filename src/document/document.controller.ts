import { DocumentService } from '@/document/document.service'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/uploads')
export class DocumentController {
  constructor(private document: DocumentService) {}

  @Post('/temp')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true)
        } else {
          cb(
            new BadRequestException('Apenas arquivos PDF são permitidos'),
            false,
          )
        }
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10mb,
    }),
  )
  async handle(@UploadedFile() file: Express.Multer.File) {
    try {
      await this.document.uploadFile({ file })
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }

  @Post('extract')
  async extractData(@Body() body: { filePath: string; keys: string[] }) {
    return await this.document.extractData(body.filePath, body.keys)
  }
}
