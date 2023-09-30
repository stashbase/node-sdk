import { AxiosInstance } from 'axios'

// export interface DeleteEnvironmentSecretOpts {
//   printTable?: boolean
// }
//
async function deleteEnvironmentSecret(
  client: AxiosInstance,
  keys: string[]
): Promise<{ notFound?: string[] }> {
  try {
    const { data } = await client.post<{
      notFound?: string[]
    }>(`/delete`, {
      keys,
    })

    return data
  } catch (error) {
    console.log(error)

    // if (shouldThrow || shouldThrow === undefined) {
    throw error
    // }
  }
}

export { deleteEnvironmentSecret }
