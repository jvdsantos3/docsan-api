import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '@/database/prisma.service'
import { BranchActivityEvent } from '../branch-activity.event'

@Injectable()
export class BranchActivityCreatedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('branch-activity.created')
  async handle(event: BranchActivityEvent) {
    await this.prisma.actionLog.create({
      data: {
        action: 'branch-activity.created',
        branchActivityId: event.branchActivityId,
        userId: event.userId,
      },
    })
  }
}
