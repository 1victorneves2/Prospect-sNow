import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Public } from '../auth/auth.decorators'

@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  check() {
    return {
      status: 'ok',
      service: 'snowdrop-prospect-api',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('database')
  async checkDatabase() {
    try {
      await this.prisma.checkConnection()
    } catch {
      throw new ServiceUnavailableException()
    }

    return { status: 'ok' }
  }
}
