import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PUBLIC_ROUTE } from './auth.decorators'
import { IDENTITY_VERIFIER } from './auth.types'
import type { AuthenticatedRequest, AuthenticatedUser, IdentityVerifier } from './auth.types'

function validIdentity(value: AuthenticatedUser | null): value is AuthenticatedUser {
  return Boolean(
    value &&
    typeof value.userId === 'string' &&
    value.userId.trim() &&
    typeof value.organizationId === 'string' &&
    value.organizationId.trim() &&
    (value.role === 'ADMIN' || value.role === 'MEMBER'),
  )
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(IDENTITY_VERIFIER) private readonly verifier: IdentityVerifier,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const authorization = request.headers.authorization
    const match =
      typeof authorization === 'string' ? /^Bearer ([^\s]+)$/i.exec(authorization) : null
    if (!match) throw new UnauthorizedException()

    let identity: AuthenticatedUser | null
    try {
      identity = await this.verifier.verify(match[1])
    } catch {
      throw new UnauthorizedException()
    }
    if (!validIdentity(identity)) throw new UnauthorizedException()
    request.user = identity
    return true
  }
}
