import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchDocumentTypesUseCase } from '@/use-cases/fetch-document-types'

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
    .default('10')
    .transform(Number)
    .pipe(z.number().min(1)),
  order: z.enum(['desc', 'asc']).optional(),
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
    { page, limit, order }: FetchDocumentTypesParamSchema,
  ) {
    try {
      const { documentTypes } = await this.fetchDocumentTypesUseCase.execute({
        page,
        limit,
        order,
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
