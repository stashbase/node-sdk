const RETRY_DELAY_MS = 3000

type RetryOptions = {
  retries?: number
  timeoutMs?: number
  signal?: AbortSignal
}

const createAbortError = (): Error => {
  const error = new Error('The request was aborted.')
  error.name = 'AbortError'
  return error
}

const isAbortError = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError'

const sleep = (ms: number, signal?: AbortSignal): Promise<void> => {
  if (!signal) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  if (signal.aborted) {
    return Promise.reject(createAbortError())
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    const onAbort = () => {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      reject(createAbortError())
    }

    signal.addEventListener('abort', onAbort)
  })
}

const createAttemptSignal = (signal?: AbortSignal, timeoutMs?: number) => {
  const controller = new AbortController()

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let onAbort: (() => void) | undefined

  if (signal) {
    if (signal.aborted) {
      controller.abort()
    } else {
      onAbort = () => controller.abort()
      signal.addEventListener('abort', onAbort)
    }
  }

  if (typeof timeoutMs === 'number' && timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      controller.abort()
    }, timeoutMs)
  }

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (signal && onAbort) {
      signal.removeEventListener('abort', onAbort)
    }
  }

  return { signal: controller.signal, cleanup }
}

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> => {
  const retries = retryOptions?.retries ?? 3

  const fetchRetry = async (attemptsRemaining: number): Promise<Response> => {
    const { signal, cleanup } = createAttemptSignal(retryOptions?.signal, retryOptions?.timeoutMs)

    try {
      const response = await fetch(url, {
        ...options,
        signal,
      })

      cleanup()

      if (response.status === 500) {
        if (attemptsRemaining === 1) {
          return response
        }

        await sleep(RETRY_DELAY_MS, retryOptions?.signal)
        return fetchRetry(attemptsRemaining - 1)
      }

      return response
    } catch (error) {
      cleanup()

      if (isAbortError(error)) {
        throw error
      }

      if (attemptsRemaining === 1) {
        throw error
      }

      await sleep(RETRY_DELAY_MS, retryOptions?.signal)
      return fetchRetry(attemptsRemaining - 1)
    }
  }

  if (retryOptions?.signal?.aborted) {
    throw createAbortError()
  }

  return fetchRetry(retries)
}

export default fetchWithRetry
