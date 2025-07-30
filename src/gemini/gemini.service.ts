import { EnvService } from '@/env/env.service'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI

  constructor(private envService: EnvService) {
    this.genAI = new GoogleGenerativeAI(this.envService.get('GOOGLE_API_KEY'))
  }

  async generate(
    prompt: string,
    fileType: string,
    body: Buffer,
  ): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    }

    const base64Data = body.toString('base64')

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: fileType,
                data: base64Data,
              },
            },
            {
              text: `${prompt} - Formato de retorno desejado: [{ "name": [Nome do campo], "value": [Valor coletado] }] caso não consiga coletar o valor coloque null, colete somente os campos passados e ignore o restante.`,
            },
          ],
        },
      ],
    })

    const result = await chatSession.sendMessage('INSERT_INPUT_HERE')

    return result.response.text()
  }
}
