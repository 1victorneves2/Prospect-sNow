import { SetMetadata } from '@nestjs/common'
import type { UserRole } from './auth.types'

export const PUBLIC_ROUTE = 'snowdrop:public'
export const ALLOWED_ROLES = 'snowdrop:roles'

export const Public = () => SetMetadata(PUBLIC_ROUTE, true)
export const Roles = (...roles: UserRole[]) => SetMetadata(ALLOWED_ROLES, roles)
