import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { DocumentTypeCreatedListener } from './listeners/document-type-created.listener'
import { DocumentTypeUpdatedListener } from './listeners/document-type-updated.listener'
import { DocumentCreatedListener } from './listeners/document-created.listener'
import { RegistryTypeCreatedListener } from './listeners/registry-type-created.listener'
import { RegistryTypeUpdatedListener } from './listeners/registry-type-updated.listener'
import { CnaeCreatedListener } from './listeners/cnae-created.listener'
import { CnaeUpdatedListener } from './listeners/cnae-updated.listener'
import { BranchActivityCreatedListener } from './listeners/branch-activity-updated.listener'
import { BranchActivityUpdatedListener } from './listeners/branch-activity-created.listener'

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    PrismaService,
    DocumentTypeCreatedListener,
    DocumentTypeUpdatedListener,
    DocumentCreatedListener,
    RegistryTypeCreatedListener,
    RegistryTypeUpdatedListener,
    CnaeCreatedListener,
    CnaeUpdatedListener,
    BranchActivityCreatedListener,
    BranchActivityUpdatedListener,
  ],
})
export class EventModule {}
