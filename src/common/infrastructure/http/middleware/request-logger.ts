import { NextFunction, Request, Response } from 'express'
import { writeLog } from './file-logger'

export function requestLoggerMiddleware(req: Request, _res: Response, next: NextFunction) {
  const startedAt = Date.now()

  const logEntry = {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    startedAt,
  }

  console.info('[request]', JSON.stringify(logEntry))
  writeLog({ type: 'request', ...logEntry })

  _res.on('finish', () => {
    const durationMs = Date.now() - startedAt
    const responseLog = {
      method: req.method,
      path: req.originalUrl,
      statusCode: _res.statusCode,
      durationMs,
    }

    console.info('[response]', JSON.stringify(responseLog))
    writeLog({ type: 'response', ...responseLog })
  })

  next()
}
