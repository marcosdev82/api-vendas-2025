import { AppError } from "@/common/domain/errors/app-error";
import { NextFunction, Request, Response } from 'express'

export function errorHandle(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction, 
): Response {
  if (err instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'Error',
      message: err.statusCode, 
    }})
  }

  console.error(err)

  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' })
}
