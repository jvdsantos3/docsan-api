import { Module } from '@nestjs/common'
import { EnvModule } from './infra/env/env.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './infra/env/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
  ],
})
export class AppModule {}
