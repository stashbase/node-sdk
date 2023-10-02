const fetchWithRetry = async (url: string, options: any, n = 3): Promise<Response> => {
  return new Promise(async (resolve, reject) => {
    let attempts = 1

    const fetchRetry = async (url: string, n: number) => {
      console.log(`Attempt ${attempts} to fetch`)

      try {
        const response = await fetch(url, options)

        if (response.status === 500) {
          if (n === 1) {
            resolve(response)
          } else {
            setTimeout(async () => {
              attempts++
              try {
                await fetchRetry(url, n - 1)
              } catch (error) {
                reject(error)
              }
            }, 3000)
          }
        } else {
          resolve(response)
        }
      } catch (error) {
        if (n === 1) {
          reject(error)
        } else {
          setTimeout(async () => {
            attempts++
            try {
              await fetchRetry(url, n - 1)
            } catch (error) {
              reject(error)
            }
          }, 3000)
        }
      }
    }

    await fetchRetry(url, n)
  })
}

export default fetchWithRetry
