import 'reflect-metadata'
import { Controller, Get, Module, Param, Req } from '@nestjs/common'
import { APP_GUARD, NestFactory } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import type { INestApplication } from '@nestjs/common'
import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { configureApp } from '../app.setup'
import { validateEnvironment } from '../config/env.validation'
import { Public, Roles } from './auth.decorators'
import { AuthGuard } from './auth.guard'
import { IDENTITY_VERIFIER } from './auth.types'
import type { AuthenticatedRequest, IdentityVerifier } from './auth.types'
import { organizationScope, requireOrganization } from './organization'
import { RolesGuard } from './roles.guard'

const verifier: IdentityVerifier = {
  async verify(token) {
    if (token === 'admin-token') return { userId: 'a', organizationId: 'org-a', role: 'ADMIN' }
    if (token === 'member-token') return { userId: 'm', organizationId: 'org-a', role: 'MEMBER' }
    if (token === 'other-token') return { userId: 'b', organizationId: 'org-b', role: 'MEMBER' }
    throw new Error('private provider detail')
  },
}

@Controller('authorization-test')
class TestController {
  @Public()
  @Get('public')
  publicRoute() {
    return { ok: true }
  }

  @Get('private')
  privateRoute(@Req() request: AuthenticatedRequest) {
    return organizationScope(request.user!)
  }

  @Roles('ADMIN')
  @Get('admin')
  adminRoute() {
    return { ok: true }
  }

  @Get('resource/:id')
  resource(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    const resource = id === 'one' ? { id: 'one', organizationId: 'org-a' } : null
    return requireOrganization(request.user!, resource)
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment })],
  controllers: [TestController],
  providers: [
    { provide: IDENTITY_VERIFIER, useValue: verifier },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
class TestModule {}

describe('authorization HTTP boundary', () => {
  let app: INestApplication
  let baseUrl: string
  beforeAll(async () => {
    app = await NestFactory.create(TestModule, { logger: false })
    configureApp(app)
    await app.listen(0, '127.0.0.1')
    baseUrl = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}/v1/authorization-test`
  })
  afterAll(async () => {
    await app?.close()
  })

  it('allows an explicitly public route and denies unverified requests', async () => {
    expect((await fetch(`${baseUrl}/public`)).status).toBe(200)
    expect((await fetch(`${baseUrl}/private`)).status).toBe(401)
    const invalid = await fetch(`${baseUrl}/private`, {
      headers: { Authorization: 'Bearer invalid' },
    })
    expect(invalid.status).toBe(401)
    expect(await invalid.text()).not.toContain('private provider detail')
    expect(
      (
        await fetch(`${baseUrl}/private`, {
          headers: { 'x-user-id': 'a', 'x-organization-id': 'org-a' },
        })
      ).status,
    ).toBe(401)
  })

  it('applies ADMIN and MEMBER permissions and derives organization from verified identity', async () => {
    const member = { Authorization: 'Bearer member-token', 'x-organization-id': 'org-b' }
    const response = await fetch(`${baseUrl}/private`, { headers: member })
    expect(await response.json()).toEqual({ organizationId: 'org-a' })
    expect((await fetch(`${baseUrl}/admin`, { headers: member })).status).toBe(403)
    expect(
      (await fetch(`${baseUrl}/admin`, { headers: { Authorization: 'Bearer admin-token' } }))
        .status,
    ).toBe(200)
  })

  it('does not disclose whether another organization owns a resource', async () => {
    const headers = { Authorization: 'Bearer other-token' }
    expect((await fetch(`${baseUrl}/resource/one`, { headers })).status).toBe(404)
    expect((await fetch(`${baseUrl}/resource/missing`, { headers })).status).toBe(404)
    expect(
      (
        await fetch(`${baseUrl}/resource/one`, {
          headers: { Authorization: 'Bearer member-token' },
        })
      ).status,
    ).toBe(200)
  })
})
