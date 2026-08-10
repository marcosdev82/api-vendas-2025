import { redisClient } from './redis-client'

export async function invalidateCachePattern(pattern: string) {
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
  } catch (error) {
    console.warn('[cache]', error)
  }
}

export async function invalidateCacheForResource(resource: string) {
  await invalidateCachePattern(`cache:*${resource}*`)
}
