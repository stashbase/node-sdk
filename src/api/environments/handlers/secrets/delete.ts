import { HttpClient } from '../../../../http/client'

async function deleteEnvironmentSecret(
  client: HttpClient,
  keys: string[]
): Promise<{ notFound?: string[] }> {
  try {
    // const { data } = await client.post<{
    //   notFound?: string[]
    // }>(`/delete`, {
    //   keys,
    // })
    //

    const data = await client.post<{ notFound?: string[] }>({
      path: '/delete',
      data: {
        keys,
      },
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
