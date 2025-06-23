import { ProfessionalsRepository } from '@/domain/application/repositories/professionals-repository'
import { Professional } from '@/domain/enterprise/entities/professional'

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: Professional[] = []

  async findByEmail(email: string) {
    const professional = this.items.find((item) => item.email === email)

    if (!professional) {
      return null
    }

    return professional
  }

  async create(professional: Professional) {
    this.items.push(professional)
  }
}
