import { Logger } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

const logger = new Logger('HTTP')

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID()
  const startedAt = process.hrtime.bigint()

  res.locals.requestId = requestId
  res.setHeader('X-Request-Id', requestId)

  res.once('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000
    logger.log(
      JSON.stringify({
        requestId,
        method: req.method,
        route: req.route?.path ?? 'unmatched',
        statusCode: res.statusCode,
        durationMs: Math.round(durationMs),
      }),
    )
  })

  next()
}
