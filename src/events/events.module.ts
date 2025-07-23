import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { DocumentTypeCreatedListener } from './document-type-created.listener'

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [DocumentTypeCreatedListener],
  exports: [EventEmitterModule],
})
export class EventsModule {}
