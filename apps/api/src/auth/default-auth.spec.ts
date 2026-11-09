import 'reflect-metadata'
import { Controller, Get, Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import type { INestApplication } from '@nestjs/common'
import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { configureApp } from '../app.setup'
import { validateEnvironment } from '../config/env.validation'
import { AuthModule } from './auth.module'

@Controller('protected-default')
class TestController {
  @Get()
  get() {
    return { shouldNotBeVisible: true }
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }), AuthModule],
  controllers: [TestController],
})
class TestModule {}

describe('unconfigured identity provider', () => {
  let app: INestApplication
  let url: string
  beforeAll(async () => {
    app = await NestFactory.create(TestModule, { logger: false })
    configureApp(app)
    await app.listen(0, '127.0.0.1')
    url = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}/v1/protected-default`
  })
  afterAll(async () => {
    await app?.close()
  })
  it('denies even a supplied bearer token until a verifier is configured', async () => {
    expect((await fetch(url, { headers: { Authorization: 'Bearer anything' } })).status).toBe(401)
  })
})
