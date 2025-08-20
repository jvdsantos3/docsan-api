import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'
import { ProfessionalNotFoundError } from './errors/professional-not-found-error'
import { ProfessionalCannotApprovedError } from './errors/professional-cannot-approved-error'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalStatusHistoriesRepository } from '@/database/repositories/professional-status-histories-repository'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'
import { UserPayload } from '@/auth/jwt.strategy'
import { UsersRepository } from '@/database/repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface ApproveProfessionalUseCaseRequest {
  user: UserPayload
  professionalId: string
}

@Injectable()
export class ApproveProfessionalUseCase {
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
  }: ApproveProfessionalUseCaseRequest): Promise<void> {
    const admin = await this.usersRepository.findById(user.sub)

    if (!admin) {
      throw new UserNotFoundError()
    }

    const professional = await this.professionalsRepository.show(professionalId)

    if (!professional) {
      throw new ProfessionalNotFoundError()
    }

    if (professional.status !== 'PENDING') {
      throw new ProfessionalCannotApprovedError()
    }

    await this.prisma.$transaction(async (tx) => {
      await this.professionalsRepository.save(
        {
          id: professional.id,
          status: 'APPROVED',
        },
        tx,
      )

      await this.professionalStatusHistoriesRepository.create(
        {
          changedById: admin.id,
          professionalId: professional.id,
          status: 'APPROVED',
        },
        tx,
      )
    })

    await this.mailQueue.add(
      'send-email',
      {
        to: professional.user.email,
        subject: 'Cadastro aprovado.',
        template: 'approved-professional',
        context: {
          name: professional.name,
        },
      },
      {
        delay: 3000,
      },
    )
  }
}
