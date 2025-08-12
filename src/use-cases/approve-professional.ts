import { ProfessionalsRepository } from '@/database/repositories/professionals-repository'
import { Injectable } from '@nestjs/common'
import { ProfessionalNotFoundError } from './errors/professional-not-found-error'
import { ProfessionalCannotApprovedError } from './errors/professional-cannot-approved-error'
import { PrismaService } from '@/database/prisma.service'
import { ProfessionalStatusHistoriesRepository } from '@/database/repositories/professional-status-histories-repository'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'

interface ApproveProfessionalUseCaseRequest {
  professionalId: string
}

@Injectable()
export class ApproveProfessionalUseCase {
  constructor(
    private prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.MAILS) private mailsQueue: Queue,
    private professionalsRepository: ProfessionalsRepository,
    private professionalStatusHistoriesRepository: ProfessionalStatusHistoriesRepository,
  ) {}

  async execute({
    professionalId,
  }: ApproveProfessionalUseCaseRequest): Promise<void> {
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
          professionalId: professional.id,
          status: 'APPROVED',
        },
        tx,
      )
    })

    await this.mailsQueue.add(
      'send-approval-email',
      {
        to: professional.user.email,
        subject: 'Cadastro aprovado.',
        html: `<p>Olá ${professional.name},</p>
        <p>Seu cadastro como profissional foi aprovado com sucesso.</p>
        <p>Atenciosamente,</p>
        <p>Docsan</p>`,
      },
      {
        delay: 3000,
      },
    )
  }
}
