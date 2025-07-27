import { Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { ChangeDocumentTypeActiveUseCase } from '@/use-cases/change-document-type-active'
import {
  ChangeDocumentTypeActiveParamsSchema,
  changeDocumentTypeActiveParamsValidationPipe,
} from '@/http/schemas/change-document-type-active-schema'
import { UpdateDocumentTypePolicyHandler } from '@/casl/policies/update-document-type.policy'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'

@Controller('company/:companyId/document-types/:documentTypeId/active')
export class ChangeDocumentTypeActiveController {
  constructor(
    private changeDocumentTypeActive: ChangeDocumentTypeActiveUseCase,
  ) {}

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateDocumentTypePolicyHandler())
  async handle(
    @Param(changeDocumentTypeActiveParamsValidationPipe)
    { documentTypeId }: ChangeDocumentTypeActiveParamsSchema,
  ) {
    await this.changeDocumentTypeActive.execute({
      documentTypeId,
    })
  }
}
