import { UserPayload } from '@/auth/jwt.strategy'
import { PrismaService } from '@/database/prisma.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InvitationStatus } from '@prisma/client'

@Injectable()
export class AuthzService {
  constructor(private prisma: PrismaService) {}

  async checkPermission(
    user: UserPayload,
    companyId: string,
    action: string,
  ): Promise<boolean> {
    if (user.role === 'OWNER') {
      const owner = await this.prisma.owner.findUnique({
        where: { id: user.sub },
        include: { company: true },
      })

      if (owner?.companyId === companyId) {
        return true
      }

      throw new UnauthorizedException('Owner não autorizado para esta empresa')
    }

    if (user.role === 'PROFESSIONAL') {
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
        throw new UnauthorizedException(
          'Professional não está associado a esta empresa',
        )
      }

      const permissions = professionalCompany.permissions as Record<
        string,
        boolean
      >
      if (!permissions || !permissions[action]) {
        throw new UnauthorizedException(
          `Permissão insuficiente para ${action} na empresa ${companyId}`,
        )
      }

      return permissions[action]
    }

    throw new UnauthorizedException('Papel de usuário inválido')
  }

  async setPermission(
    professionalId: string,
    companyId: string,
    action: string,
    isAllowed: boolean,
  ): Promise<void> {
    const professionalCompany =
      await this.prisma.professionalCompany.findUnique({
        where: {
          professionalId_companyId: {
            professionalId,
            companyId,
          },
        },
      })

    if (!professionalCompany) {
      throw new UnauthorizedException(
        'Professional não está associado a esta empresa',
      )
    }

    const currentPermissions =
      (professionalCompany.permissions as Record<string, boolean>) || {}
    currentPermissions[action] = isAllowed

    await this.prisma.professionalCompany.update({
      where: {
        professionalId_companyId: {
          professionalId,
          companyId,
        },
      },
      data: {
        permissions: currentPermissions,
      },
    })
  }

  async createInvitation(
    ownerId: string,
    professionalId: string,
    companyId: string,
  ): Promise<void> {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: { company: true },
    })

    if (!owner || owner.companyId !== companyId) {
      throw new UnauthorizedException('Owner não autorizado para esta empresa')
    }

    await this.prisma.invitation.create({
      data: {
        professionalId,
        companyId,
        status: InvitationStatus.PENDING,
      },
    })
  }

  async updateInvitation(
    invitationId: string,
    professionalId: string,
    status: InvitationStatus,
  ): Promise<void> {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    })

    if (!invitation || invitation.professionalId !== professionalId) {
      throw new UnauthorizedException(
        'Convite inválido ou não pertence a este Professional',
      )
    }

    if (status === InvitationStatus.ACCEPTED) {
      await this.prisma.professionalCompany.create({
        data: {
          professionalId,
          companyId: invitation.companyId,
          permissions: {},
        },
      })
    }

    await this.prisma.invitation.update({
      where: { id: invitationId },
      data: { status },
    })
  }

  async logAction(
    user: UserPayload,
    companyId: string,
    action: string,
    resourceType: 'DOCUMENT' | 'DOCUMENT_TYPE',
    resourceId: string,
  ): Promise<void> {
    await this.prisma.actionLog.create({
      data: {
        action,
        companyId,
        ownerId: user.role === 'OWNER' ? user.sub : null,
        professionalId: user.role === 'PROFESSIONAL' ? user.sub : null,
        documentId: resourceType === 'DOCUMENT' ? resourceId : null,
        documentTypeId: resourceType === 'DOCUMENT_TYPE' ? resourceId : null,
      },
    })
  }

  async listCompaniesForProfessional(professionalId: string): Promise<any[]> {
    return this.prisma.professionalCompany.findMany({
      where: { professionalId },
      include: { company: true },
    })
  }

  async listProfessionalsForCompany(companyId: string): Promise<any[]> {
    return this.prisma.professionalCompany.findMany({
      where: { companyId },
      include: { professional: true },
    })
  }

  async listActionLogs(
    companyId: string,
    resourceType?: 'DOCUMENT' | 'DOCUMENT_TYPE',
    resourceId?: string,
  ): Promise<any[]> {
    return this.prisma.actionLog.findMany({
      where: {
        companyId,
        ...(resourceType && { resourceType }),
        ...(resourceId && { resourceId }),
      },
      include: {
        company: true,
        document: true,
        documentType: true,
        owner: true,
        professional: true,
      },
    })
  }
}
