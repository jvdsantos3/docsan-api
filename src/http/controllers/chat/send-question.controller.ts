import { Public } from '@/auth/public'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import {
  SendQuestionBodySchema,
  sendQuestionValidationPipe,
} from '@/http/schemas/send-question-schema'
import { ChatLimitGuard } from '@/http/guards/chat-limit.guard'
import { AnswerQuestionUseCase } from '@/use-cases/answer-question'

@Controller('/chat/questions')
@Public()
export class SendQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  @HttpCode(201)
  @UseGuards(ChatLimitGuard)
  @UsePipes(sendQuestionValidationPipe)
  async handle(@Body() { prompt }: SendQuestionBodySchema) {
    const { answer } = await this.answerQuestion.execute({
      prompt,
    })

    return {
      answer,
    }
  }
}
