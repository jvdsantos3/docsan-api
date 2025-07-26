import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { FetchDocumentsUseCase } from '@/use-cases/fetch-documents'
import { PoliciesGuard } from '@/casl/policies.guard'
import { CheckPolicies } from '@/casl/check-policies.decorator'
import { ReadDocumentPolicyHandler } from '@/casl/policies/read-document.policy'

const companyIdRouteParamSchema = z.string()

const paramValidationPipe = new ZodValidationPipe(companyIdRouteParamSchema)

type CompanyIdRouteParamSchema = z.infer<typeof companyIdRouteParamSchema>

const fetchDocumentsParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .optional()
    .default('15')
    .transform(Number)
    .pipe(z.number().min(1)),
  order: z.enum(['desc', 'asc']).optional(),
  orderBy: z
    .enum(['name', 'type', 'status', 'duedate', 'createdAt'])
    .optional(),
  type: z.string().optional(),
  status: z.enum(['inDay', 'near', 'won']).optional(),
  filter: z.string().optional(),
})

const queryValidationPipe = new ZodValidationPipe(fetchDocumentsParamSchema)

type FetchDocumentsParamSchema = z.infer<typeof fetchDocumentsParamSchema>

@Controller('/documents')
export class FetchDocumentsController {
  constructor(private fetchDocuments: FetchDocumentsUseCase) {}

  @Get(':companyId')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadDocumentPolicyHandler())
  async handle(
    @Param('companyId', paramValidationPipe)
    companyId: CompanyIdRouteParamSchema,
    @Query(queryValidationPipe)
    {
      page,
      limit,
      order,
      orderBy,
      status,
      type,
      filter,
    }: FetchDocumentsParamSchema,
  ) {
    try {
      const documents = await this.fetchDocuments.execute({
        companyId,
        page,
        limit,
        order,
        orderBy,
        status,
        type,
        filter,
      })

      return documents
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
