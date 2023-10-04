import { HttpClient } from '../../../http/client'
import { CreateEnvironmentArgs, createEnvironment } from './handlers/create'
import { DeleteEnvironmentArgs, deleteEnvironment } from './handlers/delete'
import { GetEnvironmentArgs, GetEnvironmentOpts, getEnvironment } from './handlers/get'
import { ListEnvironmentArgs, listEnvironments } from './handlers/list'
import { LockEnvironmentArgs, lockUnlockEnvironment } from './handlers/lock'
import { RenameEnvironmentArgs, renameEnvironment } from './handlers/rename'

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

  /**
   * @summary Create environment
   * @description Environment
   * @param args create argumens;
   * @returns null
   * */
  async function remove(args: DeleteEnvironmentArgs) {
    return await deleteEnvironment(httpClient, args)
  }

  /**
   * @summary Rename environment
   * @description Environment
   * @param args rename argumens;
   * @returns null
   * */
  async function rename(args: RenameEnvironmentArgs) {
    return await renameEnvironment(httpClient, args)
  }

  /**
   * @summary Lock environment
   * @description Environment
   * @param args lock argumens;
   * @returns null
   * */
  async function lock(args: LockEnvironmentArgs) {
    return await lockUnlockEnvironment(httpClient, args, true)
  }

  /**
   * @summary Unlock environment
   * @description Environment
   * @param args lock argumens;
   * @returns null
   * */
  async function unlock(args: LockEnvironmentArgs) {
    return await lockUnlockEnvironment(httpClient, args, false)
  }

  return {
    get,
    list,
    create,
    rename,
    lock,
    unlock,
    remove,
  }
}
