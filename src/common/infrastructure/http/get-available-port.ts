import net from 'node:net'

export async function getAvailablePort(startPort: number, maxAttempts = 10): Promise<number> {
  return await new Promise((resolve, reject) => {
    const tryPort = (port: number, attempt: number) => {
      const server = net.createServer()

      server.once('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE' && attempt < maxAttempts) {
          tryPort(port + 1, attempt + 1)
          return
        }

        reject(error)
      })

      server.once('listening', () => {
        server.close(() => resolve(port))
      })

      server.listen(port)
    }

    tryPort(startPort, 1)
  })
}
