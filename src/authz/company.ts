import { SetMetadata } from '@nestjs/common'

export const COMPANY_KEY = 'companyId'
export const Company = (companyId: string) => SetMetadata(COMPANY_KEY, companyId)
