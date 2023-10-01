import { LoadEnvironmentOpts, loadEnvironment } from './handlers/load'
import { GetEnvironmentOpts, getEnvironment } from './handlers/get'
import { deleteEnvironmentSecret } from './handlers/secrets/delete'
import { HttpClient } from '../../http/client'

function environmentsAPI(httpClient: HttpClient) {
  // load and inject environment variables
  async function load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return
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
    return await deleteEnvironmentSecret(httpClient, keys)
  }

  return {
    remove,
  }
}

export default environmentsAPI
