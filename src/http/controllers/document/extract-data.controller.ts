import { ExtractDataUseCase } from '@/use-cases/extract-data'
import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const extractDataBodySchema = z.object({
  documentTypeId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(extractDataBodySchema)

type ExtractDataBodySchema = z.infer<typeof extractDataBodySchema>

@Controller('/documents/extract')
export class ExtractDataController {
  constructor(private extractData: ExtractDataUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 10, // 10mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body(bodyValidationPipe) { documentTypeId }: ExtractDataBodySchema,
  ) {
    try {
      const { fields } = await this.extractData.execute({
        documentTypeId,
        fileType: file.mimetype,
        body: file.buffer,
      })

      return fields
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
