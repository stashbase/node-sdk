import { HttpClient } from '../../../http/client'
import { GetEnvironmentArgs, GetEnvironmentOpts, getEnvironment } from './handlers/get'

export function environmentsAPI(httpClient: HttpClient) {
  /**
   * @summary Get environment
   * @description Environment
   * @param args project, environment;
   * @param options Options (return secrets);
   * @returns Environment data
   * */
  async function get(args: GetEnvironmentArgs, options?: GetEnvironmentOpts) {
    return await getEnvironment(httpClient, args, options)
  }

  return {
    get,
  }
}
