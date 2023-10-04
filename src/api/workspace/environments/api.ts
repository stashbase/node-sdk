import { HttpClient } from '../../../http/client'
import { CreateEnvironmentArgs, createEnvironment } from './handlers/create'
import { GetEnvironmentArgs, GetEnvironmentOpts, getEnvironment } from './handlers/get'
import { ListEnvironmentArgs, listEnvironments } from './handlers/list'

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

  /**
   * @summary List environments
   * @description Environment
   * @param args project;
   * @returns Environment array
   * */
  async function list(args: ListEnvironmentArgs) {
    return await listEnvironments(httpClient, args)
  }

  /**
   * @summary Create environment
   * @description Environment
   * @param args create argumens;
   * @returns null
   * */
  async function create(args: CreateEnvironmentArgs) {
    return await createEnvironment(httpClient, args)
  }

  return {
    get,
    list,
    create,
  }
}
