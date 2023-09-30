import { AxiosInstance } from 'axios'
import { LoadEnvironmentOpts, loadEnvironment } from './handlers/load'

// access only selected environment with environment token
// client with env token
function environmentsAPI(envClient: AxiosInstance) {
  async function load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return
    }

    return await loadEnvironment(envClient, options)
  }

  return {
    load,
  }
}

export default environmentsAPI
