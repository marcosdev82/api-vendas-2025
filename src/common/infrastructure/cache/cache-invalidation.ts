import { redisClient } from './redis-client'

function shouldLogCacheWarnings(): boolean {
  return process.env.NODE_ENV !== 'test'
}

export async function invalidateCachePattern(pattern: string) {
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
  } catch (error) {
    if (shouldLogCacheWarnings()) {
      console.warn('[cache]', error)
    }
  }
}

export async function invalidateCacheForResource(resource: string) {
  await invalidateCachePattern(`cache:*${resource}*`)
}
