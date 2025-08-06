import { Public } from '@/auth/public'
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import {
  SendQuestionBodySchema,
  sendQuestionValidationPipe,
} from '@/http/schemas/send-question-schema'
import { ChatLimitGuard } from '@/http/guards/chat-limit.guard'
import { AnswerQuestionUseCase } from '@/use-cases/answer-question'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

@Controller('/chat/questions/private')
export class SendQuestionPrivateController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  @UseGuards(ChatLimitGuard)
  async handle(
    @CurrentUser() payload: UserPayload,
    @Body(sendQuestionValidationPipe) { prompt }: SendQuestionBodySchema,
  ) {
    const { answer } = await this.answerQuestion.execute({
      prompt,
      payload,
    })

    return {
      answer,
    }
  }
}
