import type { Request } from 'express'

export type UserRole = 'ADMIN' | 'MEMBER'

export type AuthenticatedUser = {
  userId: string
  organizationId: string
  role: UserRole
}

export type AuthenticatedRequest = Request & { user?: AuthenticatedUser }

export interface IdentityVerifier {
  verify(token: string): Promise<AuthenticatedUser | null>
}

export const IDENTITY_VERIFIER = Symbol('IDENTITY_VERIFIER')
