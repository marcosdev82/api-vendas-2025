import 'reflect-metadata'
import { env } from '../env'
import { dataSource } from '../typeorm'
import { initializeWithRetry } from '../typeorm/initialize-with-retry'
import { app } from './app'
import { getAvailablePort } from './get-available-port'
import '@/common/infrastructure/container'
import { connectRedis } from '../cache/redis-client'

initializeWithRetry(() => dataSource.initialize(), {
  retries: 15,
  delayMs: 1000,
})
  .then(async () => {
    await connectRedis()

    const port = await getAvailablePort(env.PORT).catch(() => env.PORT)

    app.listen(port, () => {
      console.log(`Server running on port ${port}! 🏆`)
      console.log(`API docs available GET: http://localhost:${port}/docs 📚`)
    })
  })
  .catch((error) => {
    console.error('❌ Error during Data Source initialization:', error)
    throw new Error('Error during Data Source initialization')
  })
