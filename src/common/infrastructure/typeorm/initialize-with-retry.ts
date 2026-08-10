export type InitializeWithRetryOptions = {
  retries?: number
  delayMs?: number
}

export async function initializeWithRetry<T>(
  operation: () => Promise<T>,
  options: InitializeWithRetryOptions = {},
): Promise<T> {
  const retries = options.retries ?? 10
  const delayMs = options.delayMs ?? 1000

  let lastError: unknown

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (attempt === retries) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError
}
