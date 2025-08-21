import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EventModule } from './events/event.module'
import { QueueModule } from './queue/queue.module'
import { SchedulesModule } from './schedules/schedules.module'
import { MailModule } from './mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EventModule,
    AuthModule,
    HttpModule,
    EnvModule,
    QueueModule,
    MailModule,
    SchedulesModule,
  ],
})
export class AppModule {}
