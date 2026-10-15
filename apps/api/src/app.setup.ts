import { INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Environment } from './config/env.validation'
import { ApiExceptionFilter } from './http/api-exception.filter'
import { requestContextMiddleware } from './http/request-context.middleware'

export function configureApp(app: INestApplication) {
  const config = app.get(ConfigService<Environment, true>)

  app.setGlobalPrefix('v1')
  app.enableCors({
    origin: config.get('APP_URL', { infer: true }),
    credentials: true,
    exposedHeaders: ['X-Request-Id'],
  })
  app.use(requestContextMiddleware)
  app.useGlobalFilters(new ApiExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
}
