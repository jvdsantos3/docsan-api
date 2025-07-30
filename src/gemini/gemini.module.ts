import { Module } from '@nestjs/common'
import { GeminiService } from './gemini.service'
import { EnvModule } from '@/env/env.module'

@Module({
  imports: [EnvModule],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
