import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CreateServicePolicyHandler } from '@/casl/policies/create-service.policy'
import {
  createServiceValidationPipe,
  type CreateServiceBodySchema,
} from '@/http/schemas/create-service-schema'
import { CreateServiceUseCase } from '@/use-cases/create-service'
import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/services')
export class CreateServicesController {
  constructor(private createService: CreateServiceUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateServicePolicyHandler())
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  async handle(
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
    @Body(createServiceValidationPipe)
    { name, summary, description }: CreateServiceBodySchema,
  ) {
    await this.createService.execute({
      payload,
      name,
      summary,
      description,
      fileName: file?.originalname,
      fileType: file?.mimetype,
      body: file?.buffer,
    })

    return {
      message: 'Serviço criado.',
    }
  }
}
