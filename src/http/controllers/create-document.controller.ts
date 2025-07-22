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
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateDocumentUseCase } from '@/use-cases/create-document'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

const createDocumentBodySchema = z.object({
  documentTypeId: z.string(),
  fields: z
    .string()
    .transform((val) => {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        throw new Error('Fields must be a JSON array')
      }
      return parsed
    })
    .pipe(
      z
        .array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        )
        .nonempty(),
    ),
})

const bodyValidationPipe = new ZodValidationPipe(createDocumentBodySchema)

type CreateDocumentBodySchema = z.infer<typeof createDocumentBodySchema>

@Controller('/documents')
export class CreateDocumentController {
  constructor(private createDocument: CreateDocumentUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @CurrentUser() user: UserPayload,
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
    @Body(bodyValidationPipe)
    { documentTypeId, fields }: CreateDocumentBodySchema,
  ) {
    try {
      await this.createDocument.execute({
        user,
        documentTypeId,
        fileType: file.mimetype,
        fileName: file.originalname,
        body: file.buffer,
        fields,
      })
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
