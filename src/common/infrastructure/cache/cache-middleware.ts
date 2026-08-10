import { NextFunction, Request, Response } from 'express'
import { redisClient } from './redis-client'

export function cacheMiddleware(ttlSeconds = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next()
    }

    const key = `cache:${req.originalUrl}`

    try {
      const cached = await redisClient.get(key)
      if (cached) {
        return res.status(200).json(JSON.parse(cached))
      }
    } catch (error) {
      console.warn('[cache]', error)
    }

    const originalJson = res.json.bind(res)
    res.json = ((body: unknown) => {
      Promise.resolve()
        .then(async () => {
          try {
            await redisClient.setEx(key, ttlSeconds, JSON.stringify(body))
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
