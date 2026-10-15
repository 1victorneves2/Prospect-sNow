import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Response } from 'express'

const messages: Partial<Record<HttpStatus, { code: string; message: string }>> = {
  [HttpStatus.BAD_REQUEST]: { code: 'BAD_REQUEST', message: 'Requisição inválida.' },
  [HttpStatus.UNAUTHORIZED]: { code: 'UNAUTHORIZED', message: 'Autenticação necessária.' },
  [HttpStatus.FORBIDDEN]: { code: 'FORBIDDEN', message: 'Acesso não permitido.' },
  [HttpStatus.NOT_FOUND]: { code: 'NOT_FOUND', message: 'Recurso não encontrado.' },
  [HttpStatus.CONFLICT]: { code: 'CONFLICT', message: 'Conflito ao processar a requisição.' },
  [HttpStatus.TOO_MANY_REQUESTS]: { code: 'RATE_LIMITED', message: 'Tente novamente mais tarde.' },
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    const statusCode = exception instanceof HttpException ? exception.getStatus() : 500
    const error = messages[statusCode as HttpStatus] ?? {
      code: 'INTERNAL_ERROR',
      message: 'Não foi possível concluir a requisição.',
    }
    const requestId: string = response.locals.requestId ?? 'unavailable'

    if (statusCode >= 500) {
      this.logger.error(JSON.stringify({ requestId, statusCode, code: error.code }))
    }

    response.status(statusCode).json({ ...error, requestId })
  }
}
