import { AxiosInstance } from 'axios'
import { LoadEnvironmentOpts, loadEnvironment } from './handlers/load'
import { GetEnvironmentOpts, getEnvironment } from './handlers/get'
import { deleteEnvironmentSecret } from './handlers/secrets/delete'

// access only selected environment with environment token
// client with env token
function environmentsAPI(envClient: AxiosInstance) {
  // load and inject environment variables
  async function load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return
    }

    return await loadEnvironment(envClient, options)
  }

  async function get(options?: GetEnvironmentOpts) {
    return await getEnvironment(envClient, options)
  }

  const secrets = envSecretsAPI(envClient)

  return {
    load,
    get,
    secrets,
  }
}

function envSecretsAPI(envClient: AxiosInstance) {
  async function remove(keys: string[]) {
    return await deleteEnvironmentSecret(envClient, keys)
  }

  return {
    remove,
  }
}

export default environmentsAPI
