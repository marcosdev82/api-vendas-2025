import { NextFunction, Request, Response } from 'express'

function getConfiguredApiKeys(): string[] {
  return (process.env.API_KEYS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

function extractApiKey(req: Request): string | null {
  const fromHeader = req.header('x-api-key')
  if (fromHeader && fromHeader.trim().length > 0) {
    return fromHeader.trim()
  }

  const authHeader = req.header('authorization')
  if (!authHeader) {
    return null
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme?.toLowerCase() === 'apikey' && token?.trim()) {
    return token.trim()
  }

  return null
}

export function apiKeyAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const isApiKeyRequired = process.env.API_KEY_REQUIRED === 'true'
  if (!isApiKeyRequired) {
    return next()
  }

  const configuredKeys = getConfiguredApiKeys()

  // Safety fallback: do not block if required flag is on but keys are absent.
  if (configuredKeys.length === 0) {
    return next()
  }

  const providedKey = extractApiKey(req)
  if (!providedKey) {
    return res.status(401).json({
      status: 'error',
      message: 'API key required. Send x-api-key header.',
    })
  }

  if (!configuredKeys.includes(providedKey)) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid API key',
    })
  }

  return next()
}
