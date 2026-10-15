import 'reflect-metadata'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configureApp } from './app.setup'
import type { Environment } from './config/env.validation'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService<Environment, true>)

  configureApp(app)

  await app.listen(config.get('PORT', { infer: true }))
}

void bootstrap()
