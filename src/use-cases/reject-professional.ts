import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'
import { ProfessionalNotFoundError } from './errors/professional-not-found-error'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalStatusHistoriesRepository } from '@/database/repositories/professional-status-histories-repository'
import { UserPayload } from '@/auth/jwt.strategy'
import { UsersRepository } from '@/database/repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'
import { Queue } from 'bull'

interface RejectProfessionalUseCaseRequest {
  user: UserPayload
  professionalId: string
  reason: string
}

@Injectable()
export class RejectProfessionalUseCase {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.MAILS) private mailQueue: Queue,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
    private professionalStatusHistoriesRepository: ProfessionalStatusHistoriesRepository,
  ) {}

  async execute({
    user,
    professionalId,
    reason,
  }: RejectProfessionalUseCaseRequest): Promise<void> {
    const admin = await this.usersRepository.findById(user.sub)

    if (!admin) {
      throw new UserNotFoundError()
    }

    const professional = await this.professionalsRepository.show(professionalId)

    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    await this.prisma.$transaction(async (tx) => {
      const status = 'REJECTED'

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

    await this.mailQueue.add(
      'send-email',
      {
        to: professional.user.email,
        subject: 'Cadastro reprovado.',
        template: 'rejected-professional',
        context: {
          name: professional.name,
          reason,
        },
      },
      {
        delay: 3000,
        attempts: 3,
        backoff: {
          type: 'fixer',
          delay: 30000,
        },
      },
    )
  }
}
