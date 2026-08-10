import { NextFunction, Request, Response } from 'express'

export function swaggerAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const expectedUser = process.env.SWAGGER_USER ?? 'admin'
  const expectedPass = process.env.SWAGGER_PASS ?? 'admin123'
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Docs"')
    return res.status(401).json({ status: 'error', message: 'Swagger credentials required' })
  }

  const [scheme, encoded] = authHeader.split(' ')
  if (scheme !== 'Basic' || !encoded) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Docs"')
    return res.status(401).json({ status: 'error', message: 'Invalid authentication header' })
  }

  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const [username, password] = decoded.split(':')

  if (username === expectedUser && password === expectedPass) {
    return next()
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Docs"')
  return res.status(401).json({ status: 'error', message: 'Invalid Swagger credentials' })
}
