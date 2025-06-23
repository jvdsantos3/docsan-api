import { Professional } from '@/domain/enterprise/entities/professional'

export abstract class ProfessionalsRepository {
  abstract findByEmail(email: string): Promise<Professional | null>
  abstract create(professional: Professional): Promise<void>
}
