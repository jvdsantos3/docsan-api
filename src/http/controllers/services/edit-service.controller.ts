import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import {
  editServiceParamsValidationPipe,
  editServiceValidationPipe,
  type EditServiceBodySchema,
  type EditServiceParamsSchema,
} from '@/http/schemas/edit-service-schema'
import { EditServiceUseCase } from '@/use-cases/edit-service'
import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UpdateServicePolicyHandler } from '@/casl/policies/update-service.policy'

@Controller('/services/:serviceId')
export class EditServiceController {
  constructor(private editService: EditServiceUseCase) {}

  @Put()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateServicePolicyHandler())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  async handle(
    @Param(editServiceParamsValidationPipe)
    { serviceId }: EditServiceParamsSchema,
    @CurrentUser() payload: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 10, // 10mb
          }),
          new FileTypeValidator({
            fileType: '.(jpg|jpeg|png|webp)',
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body(editServiceValidationPipe)
    { name, summary, description }: EditServiceBodySchema,
  ) {
    await this.editService.execute({
      serviceId,
      payload,
      name,
      summary,
      description,
      fileType: file?.mimetype,
      fileName: file?.originalname,
      body: file?.buffer,
    })

    return {
      message: 'Serviço atualizado.',
    }
  }
}
