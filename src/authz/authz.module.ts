import { PrismaService } from '@/database/prisma.service'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthzService } from './authz.service'
import { AuthzGuard } from './authz.guard'

@Module({
  providers: [
    AuthzService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthzGuard,
    },
  ],
  exports: [AuthzService],
})
export class AuthzModule {}
