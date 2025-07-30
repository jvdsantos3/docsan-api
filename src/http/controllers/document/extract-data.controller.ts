import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CreateDocumentPolicyHandler } from '@/casl/policies/create-document.policy'
import {
  ExtractDataBodySchema,
  extractDataBodyValidationPipe,
} from '@/http/schemas/extract-data-schema'
import { ExtractDataUseCase } from '@/use-cases/extract-data'
import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('company/:companyId/documents/extract')
export class ExtractDataController {
  constructor(private extractData: ExtractDataUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateDocumentPolicyHandler())
  @UseInterceptors(FileInterceptor('file'))
  async handle(
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
    @Body(extractDataBodyValidationPipe)
    { documentTypeId }: ExtractDataBodySchema,
  ) {
    const { fields } = await this.extractData.execute({
      documentTypeId,
      fileType: file.mimetype,
      body: file.buffer,
    })

    return fields
  }
}
