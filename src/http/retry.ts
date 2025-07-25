const fetchWithRetry = async (url: string, options: any, n = 3): Promise<Response> => {
  let attempts = 1

  const fetchRetry = async (url: string, n: number): Promise<Response> => {
    console.log(`Attempt ${attempts} to fetch`)

    try {
      const response = await fetch(url, options)

      if (response.status === 500) {
        if (n === 1) {
          return response
        }
        await new Promise((resolve) => setTimeout(resolve, 3000))
        attempts++
        return fetchRetry(url, n - 1)
      }
      return response
    } catch (error) {
      if (n === 1) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 3000))
      attempts++
      return fetchRetry(url, n - 1)
    }
  }

  return fetchRetry(url, n)
}

export default fetchWithRetry
