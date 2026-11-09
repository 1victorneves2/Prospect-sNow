import { ConfigService } from '@nestjs/config'
import { describe, expect, it } from 'vitest'
import type { Environment } from '../config/env.validation'
import { PrismaService } from './prisma.service'

describe('PrismaService', () => {
  it('does not create a client when DATABASE_URL is absent', () => {
    const config = new ConfigService({}) as unknown as ConfigService<Environment, true>
    const service = new PrismaService(config)

    expect(service.isConfigured).toBe(false)
    expect(() => service.db).toThrow('Database is not configured')
  })

  it('fails safely when checking an unconfigured database', async () => {
    const config = new ConfigService({}) as unknown as ConfigService<Environment, true>
    await expect(new PrismaService(config).checkConnection()).rejects.toThrow(
      'Database is not configured',
    )
  })
})
