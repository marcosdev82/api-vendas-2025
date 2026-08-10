import { initializeWithRetry } from './initialize-with-retry'

describe('initializeWithRetry', () => {
  it('retries until the operation succeeds', async () => {
    let attempts = 0

    const result = await initializeWithRetry(async () => {
      attempts += 1
      if (attempts < 3) {
        throw new Error('temporary failure')
      }

      return 'connected'
    }, { retries: 3, delayMs: 0 })

    expect(result).toBe('connected')
    expect(attempts).toBe(3)
  })

  it('throws after all retries are exhausted', async () => {
    await expect(
      initializeWithRetry(async () => {
        throw new Error('persistent failure')
      }, { retries: 2, delayMs: 0 }),
    ).rejects.toThrow('persistent failure')
  })
})
