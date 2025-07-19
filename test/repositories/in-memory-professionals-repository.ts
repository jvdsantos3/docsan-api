import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Professional, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryProfessionalsRepository
  implements ProfessionalsRepository
{
  public items: Professional[] = []

  async findById(id: string) {
    const professionals = this.items.find((item) => item.id === id)

    if (!professionals) {
      return null
    }

    return professionals
  }

  async findByEmail(email: string) {
    const professionals = this.items.find((item) => item.email === email)

    if (!professionals) {
      return null
    }

    return professionals
  }

  async findByCpf(cpf: string) {
    const professionals = this.items.find((item) => item.cpf === cpf)

    if (!professionals) {
      return null
    }

    return professionals
  }

  async create(data: Prisma.ProfessionalUncheckedCreateInput) {
    const professional = {
      id: randomUUID(),
      name: data.name,
      cpf: data.cpf,
      birthDate: new Date(data.birthDate),
      email: data.email,
      password: data.password,
      phone: data.phone,
      fieldActivity: data.fieldActivity,
      registry: data.registry,
      registryUf: data.registryUf,
      cnae: data.cnae,
      addressId: data.addressId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.items.push(professional)

    return professional
  }
}
