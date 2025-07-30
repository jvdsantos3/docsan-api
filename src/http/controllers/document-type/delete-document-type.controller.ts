import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { DeleteDocumentTypePolicyHandler } from '@/casl/policies/delete-document-type.policy'
import {
  DeleteDocumentTypeParamsSchema,
  deleteDocumentTypeParamsValidationPipe,
} from '@/http/schemas/delete-document-type-schema'
import { DeleteDocumentTypeUseCase } from '@/use-cases/delete-document-type'
import { Controller, Delete, Param, UseGuards } from '@nestjs/common'

@Controller('company/:companyId/document-types/:documentTypeId')
export class DeleteDocumentTypeController {
  constructor(private deleteDocumentType: DeleteDocumentTypeUseCase) {}

  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteDocumentTypePolicyHandler())
  async handle(
    @Param(deleteDocumentTypeParamsValidationPipe)
    { documentTypeId }: DeleteDocumentTypeParamsSchema,
  ) {
    await this.deleteDocumentType.execute({
      documentTypeId,
    })
  }
}
