import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'
import { ProfessionalNotFoundError } from './errors/professional-not-found-error'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalStatusHistoriesRepository } from '@/database/repositories/professional-status-histories-repository'
import { UserPayload } from '@/auth/jwt.strategy'
import { UsersRepository } from '@/database/repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface ChangeBanProfessionalUseCaseRequest {
  user: UserPayload
  professionalId: string
  reason: string
}

@Injectable()
export class ChangeBanProfessionalUseCase {
  constructor(
    private prisma: PrismaService,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private professionalStatusHistoriesRepository: ProfessionalStatusHistoriesRepository,
  ) {}

  async execute({
    user,
    professionalId,
    reason,
  }: ChangeBanProfessionalUseCaseRequest): Promise<void> {
    const admin = await this.usersRepository.findById(user.sub)

    if (!admin) {
      throw new UserNotFoundError()
    }

    const professional = await this.professionalsRepository.show(professionalId)

    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    await this.prisma.$transaction(async (tx) => {
      const status = professional.status === 'BANNED' ? 'PENDING' : 'BANNED'

      await this.professionalsRepository.save(
        {
          id: professional.id,
          status,
        },
        tx,
      )

      await this.professionalStatusHistoriesRepository.create(
        {
          changedById: admin.id,
          professionalId: professional.id,
          status,
          reason,
        },
        tx,
      )
    })
  }
}
