import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
import { EditDocumentTypeUseCase } from '@/use-cases/edit-document-type'
import {
  EditDocumentTypeBodySchema,
  editDocumentTypeBodyValidationPipe,
  EditDocumentTypeParamsSchema,
  editDocumentTypeParamsValidationPipe,
} from '@/http/schemas/edit-document-type-schema'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { UpdateDocumentTypePolicyHandler } from '@/casl/policies/update-document-type.policy'
import { UserPayload } from '@/auth/jwt.strategy'
import { CurrentUser } from '@/auth/current-user-decorator'

@Controller('company/:companyId/document-types/:documentTypeId')
export class EditDocumentTypeController {
  constructor(private editDocumentTypeUseCase: EditDocumentTypeUseCase) {}

  @Put()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateDocumentTypePolicyHandler())
  async handle(
    @CurrentUser() user: UserPayload,
    @Param(editDocumentTypeParamsValidationPipe)
    { companyId, documentTypeId }: EditDocumentTypeParamsSchema,
    @Body(editDocumentTypeBodyValidationPipe)
    { name, fields }: EditDocumentTypeBodySchema,
  ) {
    await this.editDocumentTypeUseCase.execute({
      user,
      companyId,
      documentTypeId,
      name,
      fields,
    })
  }
}
