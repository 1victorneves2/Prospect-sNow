import 'reflect-metadata'
import { BadRequestException, Controller, Get, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { INestApplication } from '@nestjs/common'
import { configureApp } from '../app.setup'
import { validateEnvironment } from '../config/env.validation'
import { HealthController } from '../health/health.controller'
import { PrismaService } from '../prisma/prisma.service'

const checkConnection = vi.fn<() => Promise<void>>()

@Controller('test-errors')
class TestErrorsController {
  @Get('unexpected')
  unexpected() {
    throw new Error('private-secret')
  }

  @Get('invalid')
  invalid() {
    throw new BadRequestException({ message: 'private-input' })
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment })],
  controllers: [TestErrorsController, HealthController],
  providers: [{ provide: PrismaService, useValue: { checkConnection } }],
})
class TestAppModule {}

describe('API HTTP contract', () => {
  let app: INestApplication
  let baseUrl: string

  beforeAll(async () => {
    app = await NestFactory.create(TestAppModule, { logger: false })
    configureApp(app)
    await app.listen(0, '127.0.0.1')
    const address = app.getHttpServer().address() as AddressInfo
    baseUrl = `http://127.0.0.1:${address.port}`
  })

  afterAll(async () => {
    await app?.close()
  })

  it('returns liveness with a request ID', async () => {
    const response = await fetch(`${baseUrl}/v1/health`)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get('x-request-id')).toMatch(/^[0-9a-f-]{36}$/)
    expect(body).toMatchObject({ status: 'ok', service: 'snowdrop-prospect-api' })
  })

  it('reports database health only after a successful query', async () => {
    checkConnection.mockResolvedValueOnce(undefined)
    const response = await fetch(`${baseUrl}/v1/health/database`)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
    expect(checkConnection).toHaveBeenCalled()
  })

  it('returns a safe error when the database is unavailable', async () => {
    checkConnection.mockRejectedValueOnce(new Error('private-connection-string'))
    const response = await fetch(`${baseUrl}/v1/health/database`)
    const body = await response.json()
    expect(response.status).toBe(503)
    expect(body).toMatchObject({ code: 'SERVICE_UNAVAILABLE' })
    expect(JSON.stringify(body)).not.toContain('private-connection-string')
  })

  it.each([
    ['unexpected', 500, 'INTERNAL_ERROR', 'private-secret'],
    ['invalid', 400, 'BAD_REQUEST', 'private-input'],
  ])('returns a safe error for %s', async (path, status, code, sensitiveValue) => {
    const response = await fetch(`${baseUrl}/v1/test-errors/${path}`)
    const body = await response.json()

    expect(response.status).toBe(status)
    expect(body).toMatchObject({ code, requestId: response.headers.get('x-request-id') })
    expect(JSON.stringify(body)).not.toContain(sensitiveValue)
  })
})
