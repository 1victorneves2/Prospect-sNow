import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import type { Environment } from '../config/env.validation'

/**
 * Owns the database client lifecycle without logging credentials or connection
 * strings. A local API may boot without a database, but callers must explicitly
 * check `isConfigured` before attempting a query.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client?: PrismaClient

  constructor(config: ConfigService<Environment, true>) {
    const databaseUrl = config.get('DATABASE_URL', { infer: true })

    if (databaseUrl) {
      this.client = new PrismaClient({ datasources: { db: { url: databaseUrl } } })
    }
  }

  get isConfigured(): boolean {
    return this.client !== undefined
  }

  get db(): PrismaClient {
    if (!this.client) {
      throw new Error('Database is not configured')
    }

    return this.client
  }

  async onModuleInit() {
    if (this.client) {
      await this.client.$connect()
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.$disconnect()
    }
  }
}
