import { UsersRepository } from '@/database/repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { PasswordResetTokensRepository } from '@/database/repositories/password-reset-tokens-repository'
import { isAfter } from 'date-fns'
import { HashGenerator } from '@/cryptography/hash-generator'
import { InvalidResetPasswordTokenError } from './errors/invalid-reset-password-token-error'
import { PrismaService } from '@/database/prisma.service'
import { createHash } from 'node:crypto'

interface ResetPasswordUseCaseRequest {
  token: string
  newPassword: string
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    private hashGenerator: HashGenerator,
    private prisma: PrismaService,
  ) {}

  async execute({
    token,
    newPassword,
  }: ResetPasswordUseCaseRequest): Promise<void> {
    const hashedToken = createHash('sha256').update(token).digest('hex')

    const resetToken =
      await this.passwordResetTokensRepository.findUnusedByToken(hashedToken)

    if (
      !resetToken ||
      resetToken.used ||
      isAfter(new Date(), resetToken.expiresAt)
    ) {
      throw new InvalidResetPasswordTokenError()
    }

    await this.prisma.$transaction(async (tx) => {
      const hashedPassword = await this.hashGenerator.hash(newPassword)

      await this.usersRepository.save(
        {
          id: resetToken.userId,
          password: hashedPassword,
        },
        tx,
      )

      await this.passwordResetTokensRepository.save(
        {
          id: resetToken.id,
          used: true,
        },
        tx,
      )
    })
  }
}
