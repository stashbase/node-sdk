import { printSecretsTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { ApiError, ApiResponse } from '../../../http/response'
import { createApiErrorFromResponse } from '../../../http/errors/base'

// type SecretKeyValueRecord = Record<string, string>
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

type GetEnvironmentError = ApiError<'unauthorized' | 'invalid_token' | 'token_expired'>

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

    const { secrets } = data

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
