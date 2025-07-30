import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { DocumentTypeCreatedListener } from './listeners/document-type-created.listener'
import { DocumentTypeUpdatedListener } from './listeners/document-type-updated.listener'
import { DocumentCreatedListener } from './listeners/document-created.listener'

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    PrismaService,
    DocumentTypeCreatedListener,
    DocumentTypeUpdatedListener,
    DocumentCreatedListener,
  ],
})
export class EventModule {}
