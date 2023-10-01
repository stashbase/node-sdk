import { LoadEnvironmentOpts, loadEnvironment } from './handlers/load'
import { GetEnvironmentOpts, getEnvironment } from './handlers/get'
import { deleteEnvironmentSecrets } from './handlers/secrets/delete'
import { HttpClient } from '../../http/client'
import { ApiError } from '../../http/response'

function environmentsAPI(httpClient: HttpClient) {
  // load and inject environment variables
  async function load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return { data: null, error: null }
    }

    return await loadEnvironment(httpClient, options)
  }

  async function get(options?: GetEnvironmentOpts) {
    return await getEnvironment(httpClient, options)
  }

  const secrets = envSecretsAPI(httpClient)

  return {
    load,
    get,
    secrets,
  }
}

function envSecretsAPI(httpClient: HttpClient) {
  async function remove(keys: string[]) {
    if (keys.length === 0) {
      const error: ApiError<'no_keys'> = { code: 'no_keys' }

      return { data: null, error }
    }

    return await deleteEnvironmentSecrets(httpClient, keys)
  }

  return {
    remove,
  }
}

export default environmentsAPI
