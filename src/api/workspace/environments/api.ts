import { HttpClient } from '../../../http/client'
import {
  createApiError,
  environmentNameCannotUseIdFormatError,
  invalidEnvironmentIdentifierError,
  invalidNewEnvironmentNameError,
  invalidProjectIdentifierError,
  newEnvironmentNameEqualsOriginal,
} from '../../../errors'
import {
  isResourceIdFormat,
  isValidEnvironmentName,
  isValidProjectIdentifier,
  isValidProjectName,
} from '../../../utils/inputValidation'
import { CreateEnvironmentArgs, createEnvironment } from './handlers/create'
import { DeleteEnvironmentArgs, deleteEnvironment } from './handlers/delete'
import { DuplicateEnvironmentArgs, duplicateEnvironment } from './handlers/duplicate'
import { GetEnvironmentArgs, getEnvironment } from './handlers/get'
import { ListEnvironmentArgs, listEnvironments } from './handlers/list'
import { LoadEnvironmentArgs, loadEnvironment } from './handlers/load'
import { LockEnvironmentArgs, lockUnlockEnvironment } from './handlers/lock'
import { RenameEnvironmentArgs, renameEnvironment } from './handlers/rename'
import { UpdateEnvironmentTypeArgs, updateEnvironmentType } from './handlers/updateType'
import { responseFailure, responseSuccess } from '../../../http/response'

export const checkValidProjectEnv = (projectName: string, environmentName: string) => {
  if (!isValidProjectIdentifier(projectName)) {
    const error = invalidProjectIdentifierError
    return error
  }

  if (!isValidProjectIdentifier(environmentName)) {
    const error = invalidEnvironmentIdentifierError
    return error
  }
}

export function environmentsAPI(httpClient: HttpClient) {
  /**
   * @summary Get environment
   * @description Environment
   * @param args project, environment;
   * @returns Environment data
   * */
  async function get(args: GetEnvironmentArgs) {
    const { environment, project } = args

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await getEnvironment(httpClient, args)
  }

  /**
   * @summary Load environment
   * @description Load environment (print name and type) and inject the secrets to the process, throws an error if it fails
   * @param key options print keys or key-values table with the secrets
   * @returns null
   * */
  async function loadOrThrow(args: LoadEnvironmentArgs) {
    const { environment, project } = args

    if (args?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    const { error } = await loadEnvironment(httpClient, args)

    // throws only error code
    if (error) {
      throw new Error(error?.code)
    }
  }

  /**
   * @summary Load environment
   * @description Load environment (print name and type) and inject the secrets to the process
   * @param key options print keys or key-values table with the secrets
   * @returns null
   * */
  async function load(args: LoadEnvironmentArgs) {
    const { environment, project } = args

    if (args?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await loadEnvironment(httpClient, args)
  }

  /**
   * @summary List environments
   * @description Environment
   * @param args project;
   * @returns Environment array
   * */
  async function list(args: ListEnvironmentArgs) {
    if (!isValidProjectIdentifier(args.project)) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
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
    const { project, name } = args

    // if (!isValidProjectName(project)) {
    //   const error: ApiError<'invalid_project_name'> = { code: 'invalid_project_name' }
    //
    //   return { data: null, error }
    // }

    const projectIdentifierError = isValidProjectIdentifier(project)

    if (projectIdentifierError) {
      return responseFailure(projectIdentifierError)
    }

    if (!isValidEnvironmentName(name)) {
      const error = invalidNewEnvironmentNameError
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('environment', name)

    if (nameHasIdFormat) {
      const error = environmentNameCannotUseIdFormatError
      return responseFailure(error)
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

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
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

    const identifiersError = checkValidProjectEnv(project, name)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    if (!isValidEnvironmentName(newName)) {
      const error = invalidNewEnvironmentNameError
      return responseFailure(error)
    }

    const newNameHasIdFormat = isResourceIdFormat('environment', newName)

    if (newNameHasIdFormat) {
      const error = environmentNameCannotUseIdFormatError
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('environment', name)

    if (!nameHasIdFormat && newName === name) {
      const error = newEnvironmentNameEqualsOriginal
      return responseFailure(error)
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

    const identifiersError = checkValidProjectEnv(project, name)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    if (!isValidEnvironmentName(duplicateName)) {
      const error = invalidEnvironmentIdentifierError
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('environment', name)

    if (nameHasIdFormat) {
      const error = environmentNameCannotUseIdFormatError
      return responseFailure(error)
    }

    if (name === duplicateName) {
      const error = newEnvironmentNameEqualsOriginal
      return responseFailure(error)
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

    const identifiersError = checkValidProjectEnv(project, name)

    if (identifiersError) {
      return responseFailure(identifiersError)
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

    const identifiersError = checkValidProjectEnv(project, name)

    if (identifiersError) {
      return responseFailure(identifiersError)
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

    const identifiersError = checkValidProjectEnv(project, name)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await lockUnlockEnvironment(httpClient, args, false)
  }

  return {
    get,
    load,
    loadOrThrow,
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
