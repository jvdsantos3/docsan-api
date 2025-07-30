import { CheckPolicies } from '@/casl/check-policies.decorator'
import { PoliciesGuard } from '@/casl/policies.guard'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { CreateDocumentPolicyHandler } from '@/casl/policies/create-document.policy'
import {
  CreateDocumentNotificationBodySchema,
  createDocumentNotificationBodyValidationPipe,
  CreateDocumentNotificationParamsSchema,
  createDocumentNotificationValidationPipe,
} from '@/http/schemas/create-document-notification-schema'
import { CreateDocumentNotifictionUseCase } from '@/use-cases/create-document-notification'

@Controller('/company/:companyId/documents/:documentId/notification')
export class CreateDocumentNotificationController {
  constructor(private createDocumentNotifiction: CreateDocumentNotifictionUseCase) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateDocumentPolicyHandler())
  async handle(
    @Param(createDocumentNotificationValidationPipe)
    { documentId }: CreateDocumentNotificationParamsSchema,
    @Body(createDocumentNotificationBodyValidationPipe)
    { time, period }: CreateDocumentNotificationBodySchema,
  ) {
    await this.createDocumentNotifiction.execute({
      documentId,
      time,
      period,
    })
  }
}
