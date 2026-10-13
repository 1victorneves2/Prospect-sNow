import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import type { Environment } from './config/env.validation'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService<Environment, true>)

  app.setGlobalPrefix('v1')
  app.enableCors({
    origin: config.get('APP_URL', { infer: true }),
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  await app.listen(config.get('PORT', { infer: true }))
}

void bootstrap()
