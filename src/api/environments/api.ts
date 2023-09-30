import { AxiosInstance } from 'axios'
import { LoadEnvironmentOpts, loadEnvironment } from './handlers/load'
import { GetEnvironmentOpts, getEnvironment } from './handlers/get'

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

  return {
    load,
    get,
  }
}

export default environmentsAPI
