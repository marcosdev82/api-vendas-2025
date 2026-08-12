import { AppError } from "@/common/domain/errors/app-error";
import { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'

export function errorHandle(
  err: Error,
  req: Request,
  res: Response,  
  _next: NextFunction, 
): Response {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'Error',
      message: err.message, 
    })  
  }

  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Image is too large. Max size is 5MB'
      : err.message

    return res.status(400).json({
      status: 'Error',
      message,
    })
  }

  console.error(err);

  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' })
}
