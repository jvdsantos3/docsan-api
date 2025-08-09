import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { BranchActivityEvent } from '../branch-activity.event'

@Injectable()
export class BranchActivityUpdatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('branch-activity.updated')
  async handle(event: BranchActivityEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'branch-activity.updated',
        branchActivityId: event.branchActivityId,
        userId: event.userId,
      },
    })
  }
}
