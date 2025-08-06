import { Injectable } from '@nestjs/common'
import { GeminiService } from '@/gemini/gemini.service'

interface AnswerQuestionUseCaseRequest {
  prompt: string
}

interface AnswerQuestionUseCaseResponse {
  answer: string
}

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private geminiService: GeminiService) {}

  async execute({
    prompt,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = await this.geminiService.generateText(prompt)

    return {
      answer,
    }
  }
}
