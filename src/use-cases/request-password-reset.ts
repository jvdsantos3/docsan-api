import { UsersRepository } from '@/database/repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { UserNotFoundError } from './errors/user-not-found-error'
import { createHash, randomBytes } from 'node:crypto'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_NAMES } from '@/queue/queue.constants'
import { Queue } from 'bull'
import { EnvService } from '@/env/env.service'
import { PasswordResetTokensRepository } from '@/database/repositories/password-reset-tokens-repository'
import { addMinutes } from 'date-fns'

interface RequestPasswordResetUseCaseRequest {
  email: string
}

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    private env: EnvService,
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    @InjectQueue(QUEUE_NAMES.MAILS) private mailQueue: Queue,
  ) {}

  async execute({ email }: RequestPasswordResetUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    const token = randomBytes(32).toString('hex')
    const tokenHash = createHash('sha256').update(token).digest('hex')

    const resetToken =
      await this.passwordResetTokensRepository.findUnusedByUserId(user.id)

    if (resetToken) {
      await this.passwordResetTokensRepository.save({
        id: resetToken.id,
        used: true,
      })
    }

    await this.passwordResetTokensRepository.create({
      userId: user.id,
      token: tokenHash,
      expiresAt: addMinutes(new Date(), 30),
      used: false,
    })

    const resetLink = `${this.env.get('CLIENT_URL')}/reset-password/${token}`

    await this.mailQueue.add(
      'send-email',
      {
        to: user.email,
        subject: 'Recuperação de senha.',
        html: `
          <p>Olá,</p>
          <p>Você solicitou a recuperação de sua senha. Clique no link abaixo para redefini-la:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
        `,
      },
      {
        delay: 3000,
      },
    )
  }
}
