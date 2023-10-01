import { HttpClient } from '../../../http/client'
import { ApiError, ApiResponse } from '../../../http/response'
import { createApiErrorFromResponse } from '../../../http/errors/base'
import { SecretsApiError } from '../errors/secrets'

type Secret = { key: string; value: string; description?: string }

export interface GetEnvironmentOpts {
  secrets?: boolean
  // printTable?: boolean
}

interface Environment {
  projectName: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  name: string
  createdAt: string
  description: string | null
  secrets?: Secret[]
}

type GetEnvironmentError = ApiError<SecretsApiError>

async function getEnvironment(
  client: HttpClient,
  options?: GetEnvironmentOpts
): Promise<ApiResponse<Environment, GetEnvironmentError>> {
  // const printTable = options?.printTable
  const returnSecrets = options?.secrets

  try {
    const data = await client.get<Environment>({
      path: '/',
      query: returnSecrets ? { secrets: 'true' } : undefined,
    })

    // if (printTable) {
    //   printSecretsTable({ array: secrets })
    // }

    return { data: data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { getEnvironment }
