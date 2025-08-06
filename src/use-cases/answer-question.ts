import { Injectable } from '@nestjs/common'
import { UserPayload } from '@/auth/jwt.strategy'
import { ChatHistoriesRepository } from '@/database/repositories/chat-histories-repository'
import { GeminiService } from '@/gemini/gemini.service'

interface AnswerQuestionUseCaseRequest {
  prompt: string
  payload?: UserPayload
}

interface AnswerQuestionUseCaseResponse {
  answer: string
}

@Injectable()
export class AnswerQuestionUseCase {
  constructor(
    private geminiService: GeminiService,
    private chatHistoriesRepository: ChatHistoriesRepository,
  ) {}

  async execute({
    prompt,
    payload,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = await this.geminiService.generateText(prompt)

    if (payload) {
      await this.chatHistoriesRepository.create({
        userId: payload.sub,
        question: prompt,
        answer,
      })
    }

    return {
      answer,
    }
  }
}
