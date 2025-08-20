import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { MailService } from './mail.service'
import { EnvModule } from '@/env/env.module'
import { EnvService } from '@/env/env.service'
import { join } from 'node:path'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        transport: {
          host: env.get('MAIL_HOST'),
          port: Number(env.get('MAIL_PORT')),
          secure: env.get('MAIL_SECURE'),
          auth: {
            user: env.get('MAIL_USER'),
            pass: env.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Docsan" <${env.get('MAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, '..', '..', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
