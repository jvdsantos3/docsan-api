import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'
import { FetchDocumentTypesUseCase } from '@/use-cases/fetch-document-types'
import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe'

const fetchDocumentTypesParamSchema = z.object({
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
  active: z.preprocess((val) => {
    if (val === 'true') return true
    if (val === 'false') return false
    return val
  }, z.boolean().optional()),
  filter: z.string().optional(),
})

const queryValidationPipe = new ZodValidationPipe(fetchDocumentTypesParamSchema)

type FetchDocumentTypesParamSchema = z.infer<
  typeof fetchDocumentTypesParamSchema
>

@Controller('/document-types')
export class FetchDocumentTypesController {
  constructor(private fetchDocumentTypesUseCase: FetchDocumentTypesUseCase) {}

  @Get()
  async handle(
    @Query(queryValidationPipe)
    { page, limit, order, active, filter }: FetchDocumentTypesParamSchema,
  ) {
    try {
      const documentTypes = await this.fetchDocumentTypesUseCase.execute({
        page,
        limit,
        order,
        active,
        filter,
      })

      return documentTypes
    } catch (err: any) {
      switch (err.constructor) {
        default:
          throw new BadRequestException(err.message)
      }
    }
  }
}
