import { UserPayload } from '@/auth/jwt.strategy'
import { IS_PUBLIC_KEY } from '@/auth/public'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { AuthzService } from './authz.service'
import { PERMISSION_KEY } from './permission'
import { COMPANY_KEY } from './company'

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authzService: AuthzService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const requiredPermission = this.reflector.getAllAndOverride<string>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )

    const companyIdKey = this.reflector.getAllAndOverride<string>(COMPANY_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredPermission || !companyIdKey) {
      throw new UnauthorizedException(
        'Permissão ou companyId não especificados na rota',
      )
    }

    const request = context.switchToHttp().getRequest()
    const user: UserPayload = request.user

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado')
    }

    const companyId = request.params[companyIdKey]

    if (!companyId) {
      throw new UnauthorizedException(
        'companyId não encontrado nos parâmetros da requisição',
      )
    }

    return this.authzService.checkPermission(
      user,
      companyId,
      requiredPermission,
    )
  }
}
