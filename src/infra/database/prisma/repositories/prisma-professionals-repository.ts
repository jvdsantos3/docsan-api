import { ProfessionalsRepository } from '@/domain/application/repositories/professionals-repository'
import { Professional } from '@/domain/enterprise/entities/professional'
import { PrismaService } from '../prisma.service'
import { PrismaProfessionalMapper } from '../mappers/prisma-professional-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Professional | null> {
    const professional = await this.prisma.professional.findUnique({
      where: {
        id,
      },
    })

    if (!professional) {
      return null
    }

    return PrismaProfessionalMapper.toDomain(professional)
  }

  async findByEmail(email: string): Promise<Professional | null> {
    const professional = await this.prisma.professional.findUnique({
      where: {
        email,
      },
    })

    if (!professional) {
      return null
    }

    return PrismaProfessionalMapper.toDomain(professional)
  }

  async create(professional: Professional): Promise<void> {
    const data = PrismaProfessionalMapper.toPrisma(professional)

    await this.prisma.professional.create({
      data,
    })
  }
}
