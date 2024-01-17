import { HttpClient } from '../../../http/client'
import { ApiError } from '../../../http/response'
import { isValidEnvironmentName, isValidProjectName } from '../../../utils/inputValidation'
import { CreateEnvironmentArgs, createEnvironment } from './handlers/create'
import { DeleteEnvironmentArgs, deleteEnvironment } from './handlers/delete'
import { DuplicateEnvironmentArgs, duplicateEnvironment } from './handlers/duplicate'
import { GetEnvironmentArgs, GetEnvironmentOpts, getEnvironment } from './handlers/get'
import { ListEnvironmentArgs, listEnvironments } from './handlers/list'
import { LockEnvironmentArgs, lockUnlockEnvironment } from './handlers/lock'
import { RenameEnvironmentArgs, renameEnvironment } from './handlers/rename'
import { UpdateEnvironmentTypeArgs, updateEnvironmentType } from './handlers/updateType'

export const checkValidProjectEnv = (
  projectName: string,
  environmentName: string
): ApiError<'invalid_project_name' | 'invalid_environment_name'> | undefined => {
  if (!isValidProjectName(projectName)) {
    const error: ApiError<'invalid_project_name'> = { code: 'invalid_project_name' }

    return error
  }

  if (!isValidEnvironmentName(environmentName)) {
    const error: ApiError<'invalid_environment_name'> = { code: 'invalid_environment_name' }

    return error
  }
}

export function environmentsAPI(httpClient: HttpClient) {
  /**
   * @summary Get environment
   * @description Environment
   * @param args project, environment;
   * @param options Options (return secrets);
   * @returns Environment data
   * */
  async function get(args: GetEnvironmentArgs, options?: GetEnvironmentOpts) {
    const { environment, project } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return { data: null, error: namesError }
    }

    return await getEnvironment(httpClient, args, options)
  }

  /**
   * @summary List environments
   * @description Environment
   * @param args project;
   * @returns Environment array
   * */
  async function list(args: ListEnvironmentArgs) {
    if (!isValidProjectName(args.project)) {
      const error: ApiError<'invalid_project_name'> = { code: 'invalid_project_name' }

      return { data: null, error }
    }

    return await listEnvironments(httpClient, args)
  }

  /**
   * @summary Create environment
   * @description Environment
   * @param args create argumens;
   * @returns null
   * */
  async function create(args: CreateEnvironmentArgs) {
    const { project } = args

    if (!isValidProjectName(project)) {
      const error: ApiError<'invalid_project_name'> = { code: 'invalid_project_name' }

      return { data: null, error }
    }

    return await createEnvironment(httpClient, args)
  }

  /**
   * @summary Create environment
   * @description Environment
   * @param args create argumens;
   * @returns null
   * */
  async function remove(args: DeleteEnvironmentArgs) {
    const { environment, project } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return { data: null, error: namesError }
    }

    return await deleteEnvironment(httpClient, args)
  }

  /**
   * @summary Rename environment
   * @description Environment
   * @param args rename argumens;
   * @returns null
   * */
  async function rename(args: RenameEnvironmentArgs) {
    const { project, newName, name } = args

    const namesError = checkValidProjectEnv(project, name)

    if (namesError) {
      return { data: null, error: namesError }
    }

    if (!isValidEnvironmentName(newName)) {
      const error: ApiError<'invalid_new_project_name'> = { code: 'invalid_new_project_name' }

      return { data: null, error }
    }

    return await renameEnvironment(httpClient, args)
  }

  /**
   * @summary Duplicate environment
   * @description Environment
   * @param args duplicate argumens;
   * @returns null
   * */
  async function duplicate(args: DuplicateEnvironmentArgs) {
    const { project, duplicateName, name } = args

    const namesError = checkValidProjectEnv(project, name)

    if (namesError) {
      return { data: null, error: namesError }
    }

    if (!isValidEnvironmentName(duplicateName)) {
      const error: ApiError<'invalid_environment_name'> = { code: 'invalid_environment_name' }

      return { data: null, error }
    }

    if (name === duplicateName) {
      const error: ApiError<'duplicate_environment_name'> = {
        code: 'duplicate_environment_name',
      }

      return { data: null, error }
    }

    return await duplicateEnvironment(httpClient, args)
  }

  /**
   * @summary Change environment typ
   * @description Environment
   * @param args updateType argumens;
   * @returns null
   * */
  async function updateType(args: UpdateEnvironmentTypeArgs) {
    const { project, name } = args

    const namesError = checkValidProjectEnv(project, name)

    if (namesError) {
      return { data: null, error: namesError }
    }

    return await updateEnvironmentType(httpClient, args)
  }

  /**
   * @summary Lock environment
   * @description Environment
   * @param args lock argumens;
   * @returns null
   * */
  async function lock(args: LockEnvironmentArgs) {
    const { project, name } = args

    const namesError = checkValidProjectEnv(project, name)

    if (namesError) {
      return { data: null, error: namesError }
    }

    return await lockUnlockEnvironment(httpClient, args, true)
  }

  /**
   * @summary Unlock environment
   * @description Environment
   * @param args lock argumens;
   * @returns null
   * */
  async function unlock(args: LockEnvironmentArgs) {
    const { project, name } = args

    const namesError = checkValidProjectEnv(project, name)

    if (namesError) {
      return { data: null, error: namesError }
    }

    return await lockUnlockEnvironment(httpClient, args, false)
  }

  return {
    get,
    list,
    create,
    rename,
    duplicate,
    updateType,
    lock,
    unlock,
    remove,
  }
}
