import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateDocumentUseCase } from '@/use-cases/create-document'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { CreateDocumentPolicyHandler } from '@/casl/policies/create-document.policy'
import {
  CreateDocumentBodySchema,
  createDocumentBodyValidationPipe,
  CreateDocumentParamsSchema,
  createDocumentParamsValidationPipe,
} from '@/http/schemas/create-document-schema'

@Controller('/company/:companyId/documents')
export class CreateDocumentController {
  constructor(private createDocument: CreateDocumentUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateDocumentPolicyHandler())
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @CurrentUser() payload: UserPayload,
    @Param(createDocumentParamsValidationPipe)
    { companyId }: CreateDocumentParamsSchema,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 10, // 10mb
          }),
          new FileTypeValidator({
            fileType: '.(pdf)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body(createDocumentBodyValidationPipe)
    { documentTypeId, fields }: CreateDocumentBodySchema,
  ) {
    await this.createDocument.execute({
      payload,
      companyId,
      documentTypeId,
      fileType: file.mimetype,
      fileName: file.originalname,
      body: file.buffer,
      fields,
    })
  }
}
