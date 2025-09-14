import { env } from '../env'
import { dataSource } from '../typeorm'
import { app } from './app'
import '@/common/infrastructure/container'


dataSource.initialize().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}! 🏆`)
    console.log(`API docs available GET: http://localhost:${env.PORT}/docs 📚`) 
  })
}).catch((error) => {
  console.error('❌ Error during Data Source initialization:', error)
  throw new Error('Error during Data Source initialization')
})
