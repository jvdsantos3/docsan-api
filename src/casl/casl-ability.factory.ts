import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma'
import { Action } from './actions.enum'
import { DocumentType, Document } from '@prisma/client'
import { PrismaService } from '@/database/prisma.service'
import { UserPayload } from '@/auth/jwt.strategy'

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

  async createForUser(payload: UserPayload, companyId: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    )

    if (payload.role === 'OWNER') {
      const user = await this.prisma.user.findUnique({
        include: {
          owner: true,
        },
        where: {
          id: payload.sub,
        },
      })

      if (!user) {
        throw new UnauthorizedException('User not found.')
      }

      if (user.owner?.companyId !== companyId) {
        cannot(Action.Manage, 'all')

        return build()
      }

      can(Action.Manage, 'all')
    } else {
      const professionalCompany =
        await this.prisma.professionalCompany.findUnique({
          where: {
            professionalId_companyId: {
              professionalId: payload.sub,
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
