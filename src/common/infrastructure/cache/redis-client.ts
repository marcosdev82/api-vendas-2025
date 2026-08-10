import { createClient } from 'redis'

export const redisClient = createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
})

redisClient.on('error', (err) => {
  console.error('[redis]', err)
})

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect()
  }
}

export async function disconnectRedis() {
  if (redisClient.isOpen) {
    await redisClient.disconnect()
  }
}
