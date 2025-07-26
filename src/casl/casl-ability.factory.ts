import { Injectable } from '@nestjs/common'
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma'
import { Action } from './actions.enum'
import { DocumentType, Document } from '@prisma/client'
import { User } from '@/use-cases/interfaces/user'
import { PrismaService } from '@/database/prisma.service'

type AppSubjects =
  | 'all'
  | Subjects<{
      DocumentType: DocumentType
      Document: Document
    }>

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>

@Injectable()
export class CaslAbilityFactory {
  constructor(private prisma: PrismaService) {}

  async createForUser(user: User, companyId: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    )

    if (user.role === 'OWNER') {
      const owner = await this.prisma.owner.findUnique({
        where: {
          id: user.sub,
        },
      })

      if (owner?.companyId !== companyId) {
        cannot(Action.Manage, 'all')

        return build()
      }

      can(Action.Manage, 'all')
    } else {
      const professionalCompany =
        await this.prisma.professionalCompany.findUnique({
          where: {
            professionalId_companyId: {
              professionalId: user.sub,
              companyId,
            },
          },
        })

      if (!professionalCompany) {
        cannot(Action.Manage, 'all')

        return build()
      }

      const permissions = professionalCompany.permissions as Record<
        string,
        boolean
      >

      for (const [key, value] of Object.entries(permissions)) {
        if (!value) continue

        const [resource, action] = key.split('.')

        if (!resource || !action) continue

        const subject = this.toSubjectClass(resource)

        can(action as Action, subject)
      }
    }

    return build()
  }

  private toSubjectClass(resource: string) {
    switch (resource) {
      case 'document-type':
        return 'DocumentType'
      case 'document':
        return 'Document'
      default:
        return 'all'
    }
  }
}
