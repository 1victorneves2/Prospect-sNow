import { NotFoundException } from '@nestjs/common'
import type { AuthenticatedUser } from './auth.types'

// Use the authenticated organization in database queries; never trust an organization ID from a client.
export function organizationScope(user: AuthenticatedUser): { organizationId: string } {
  return { organizationId: user.organizationId }
}

// Use when a resource has already been fetched. A missing or cross-organization resource is indistinguishable.
export function requireOrganization<T extends { organizationId: string }>(
  user: AuthenticatedUser,
  resource: T | null,
): T {
  if (!resource || resource.organizationId !== user.organizationId) throw new NotFoundException()
  return resource
}
