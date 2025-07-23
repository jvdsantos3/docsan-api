import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { DocumentTypeCreatedListener } from './document-type-created.listener'
import { AuthzModule } from '@/authz/authz.module'

@Module({
  imports: [EventEmitterModule.forRoot(), AuthzModule],
  providers: [DocumentTypeCreatedListener],
  exports: [EventEmitterModule],
})
export class EventsModule {}
