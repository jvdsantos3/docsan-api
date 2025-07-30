import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'
import { CreateDocumentTypeUseCase } from '@/use-cases/create-document-type'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { CreateDocumentTypePolicyHandler } from '@/casl/policies/create-document-type.policy'
import { PoliciesGuard } from '@/casl/policies.guard'
import {
  CreateDocumentTypeBodySchema,
  CreateDocumentTypeParamsSchema,
  createDocumentTypeParamsValidationPipe,
  createDocumentTypeValidationPipe,
} from '@/http/schemas/create-document-type-schema'

@Controller('company/:companyId/document-types')
export class CreateDocumentTypeController {
  constructor(private createDocumentType: CreateDocumentTypeUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateDocumentTypePolicyHandler())
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(createDocumentTypeParamsValidationPipe)
    { companyId }: CreateDocumentTypeParamsSchema,
    @Body(createDocumentTypeValidationPipe)
    { name, validityPeriod, prompt, fields }: CreateDocumentTypeBodySchema,
  ) {
    await this.createDocumentType.execute({
      user,
      companyId,
      name,
      validityPeriod,
      prompt,
      fields,
    })
  }
}
