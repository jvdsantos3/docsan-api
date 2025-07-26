import { Injectable } from '@nestjs/common'
import {
  UsersRepository,
  UserWithProfile,
} from '@/database/repositories/users-repository'
import { UserPayload } from '@/auth/jwt.strategy'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetProfileUseCaseRequest {
  payload: UserPayload
}

interface GetProfileUseCaseResponse {
  user: UserWithProfile
}

@Injectable()
export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    payload,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(payload.sub)

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      user,
    }
  }
}
