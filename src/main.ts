import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
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
