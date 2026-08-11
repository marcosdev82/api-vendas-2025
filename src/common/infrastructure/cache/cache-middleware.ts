import { NextFunction, Request, Response } from 'express'
import { redisClient } from './redis-client'

export function cacheMiddleware(ttlSeconds = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next()
    }

    // Keep docs/auth flows uncached to avoid changing auth challenge behavior.
    if (req.path.startsWith('/docs') || req.path.startsWith('/auth')) {
      return next()
    }

    const key = `cache:${req.originalUrl}`

    try {
      const cached = await redisClient.get(key)
      if (cached) {
        const parsed = JSON.parse(cached) as { statusCode?: number; body?: unknown } | unknown

        if (
          parsed &&
          typeof parsed === 'object' &&
          'statusCode' in parsed &&
          'body' in parsed
        ) {
          const payload = parsed as { statusCode?: number; body?: unknown }
          return res.status(payload.statusCode ?? 200).json(payload.body)
        }

        // Backward compatibility with previously cached body-only payloads.
        return res.status(200).json(parsed)
      }
    } catch (error) {
      console.warn('[cache]', error)
    }

    const originalJson = res.json.bind(res)
    res.json = ((body: unknown) => {
      Promise.resolve()
        .then(async () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return
          }

          try {
            await redisClient.setEx(
              key,
              ttlSeconds,
              JSON.stringify({ statusCode: res.statusCode, body }),
            )
          } catch (error) {
            console.warn('[cache]', error)
          }
        })
        .catch(() => undefined)

      return originalJson(body)
    }) as typeof res.json

    next()
  }
}
