import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import * as cookieParser from 'cookie-parser'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false,
  })

  app.use(cookieParser())

  const configService = app.get(EnvService)
  const port = configService.get('APP_PORT')

  app.enableCors({
    origin: '*',
  })

  await app.listen(port)
}
bootstrap()
