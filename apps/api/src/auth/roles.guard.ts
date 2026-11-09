import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ALLOWED_ROLES, PUBLIC_ROUTE } from './auth.decorators'
import type { AuthenticatedRequest, UserRole } from './auth.types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (
      this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ALLOWED_ROLES, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles) return true
    const user = context.switchToHttp().getRequest<AuthenticatedRequest>().user
    if (!user || !roles.includes(user.role)) throw new ForbiddenException()
    return true
  }
}
