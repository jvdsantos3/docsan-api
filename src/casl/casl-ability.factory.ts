import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma'
import { Action } from './actions.enum'
import {
  DocumentType,
  Document,
  RegistryType,
  Cnae,
  BranchActivity,
  Professional,
} from '@prisma/client'
import { PrismaService } from '@/database/prisma.service'
import { UserPayload } from '@/auth/jwt.strategy'

type AppSubjects =
  | 'all'
  | Subjects<{
      DocumentType: DocumentType
      Document: Document
      Cnae: Cnae
      BranchActivity: BranchActivity
      RegistryType: RegistryType
      Professional: Professional
    }>

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>

@Injectable()
export class CaslAbilityFactory {
  constructor(private prisma: PrismaService) {}

  async createForUser(payload: UserPayload, companyId?: string) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    )

    switch (payload.role) {
      case 'ADMIN': {
        const user = await this.prisma.user.findUnique({
          include: {
            admin: true,
          },
          where: {
            id: payload.sub,
          },
        })

        if (!user) {
          throw new UnauthorizedException('User not found.')
        }

        if (user.admin?.isMain) {
          can(Action.Manage, 'all')
        }

        break
      }
      case 'OWNER': {
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

        can(Action.Manage, 'DocumentType')
        can(Action.Manage, 'Document')

        break
      }
      case 'PROFESSIONAL': {
        cannot(Action.Manage, 'all')
        // const professionalCompany =
        //   await this.prisma.professionalCompany.findUnique({
        //     where: {
        //       professionalId_companyId: {
        //         professionalId: payload.sub,
        //         companyId,
        //       },
        //     },
        //   })

        // if (!professionalCompany) {
        //   cannot(Action.Manage, 'all')

        //   return build()
        // }

        // const permissions = professionalCompany.permissions as Record<
        //   string,
        //   boolean
        // >

        // for (const [key, value] of Object.entries(permissions)) {
        //   if (!value) continue

        //   const [resource, action] = key.split('.')

        //   if (!resource || !action) continue

        //   const subject = this.toSubjectClass(resource)

        //   can(action as Action, subject)
        // }

        break
      }
      default:
        throw new UnauthorizedException('Invalid user role.')
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
