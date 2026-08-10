import { NextFunction, Request, Response } from 'express'

export function errorResponseMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Error) {
    return res.status(500).json({
      status: 'error',
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
