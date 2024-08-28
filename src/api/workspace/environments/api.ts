import { HttpClient } from '../../../http/client'
import {
  createApiError,
  environmentNameUsesIdFormatError,
  invalidEnvironmentIdentifierError,
  invalidEnvironmentOrderError,
  invalidEnvironmentSearchError,
  invalidEnvironmentSortByError,
  invalidNewEnvironmentNameError,
  invalidNewProjectNameError,
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

export class EnvironmentsAPI {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Retrieves an environment by its name within a project.
   * @param args - The arguments for getting an environment.
   * @param args.environment - The name or id of the environment to retrieve.
   * @param args.project - The name or the id of the project containing the environment.
   * @returns A promise that resolves to the environment data or an error response.
   */
  async get(args: GetEnvironmentArgs) {
    const { environment, project } = args

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await getEnvironment(this.httpClient, args)
  }

  /**
   * Loads an environment and injects its secrets into the process, throwing an error if it fails.
   * @param args - The arguments for loading an environment.
   * @param args.environment - The name or id of the environment to load.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.enabled - Whether this methods is enabled (optional).
   * @throws Error with the error code if loading fails.
   * @returns A promise that resolves to null if successful.
   */
  async loadOrThrow(args: LoadEnvironmentArgs) {
    const { environment, project } = args

    if (args?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    const { error } = await loadEnvironment(this.httpClient, args)

    // throws only error code
    if (error) {
      throw new Error(error?.code)
    }
  }

  /**
   * Loads an environment and injects its secrets into the process.
   * @param args - The arguments for loading an environment.
   * @param args.environment - The name or id of the environment to load.
   * @param args.project - The name of the project containing the environment.
   * @param args.enabled - Whether the loading is enabled (optional).
   * @returns A promise that resolves to the load result or an error response.
   */
  async load(args: LoadEnvironmentArgs) {
    const { environment, project } = args

    if (args?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await loadEnvironment(this.httpClient, args)
  }

  /**
   * Lists all environments within a project.
   * @param args - The arguments for listing environments.
   * @param args.project - The name or id of the project to list environments from.
   * @returns A promise that resolves to an array of environments or an error response.
   */
  async list(args: ListEnvironmentArgs) {
    if (!isValidProjectIdentifier(args.project)) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
    }

    if (args.sortBy) {
      const sortBy = args.sortBy

      if (sortBy !== 'name' && sortBy !== 'createdAt' && sortBy !== 'secretCount') {
        const error = invalidEnvironmentSortByError
        return responseFailure(error)
      }
    }

    if (args.order) {
      const order = args.order

      if (order !== 'asc' && order !== 'desc') {
        const error = invalidEnvironmentOrderError
        return responseFailure(error)
      }
    }

    if (args.search) {
      if (!isValidEnvironmentName(args.search)) {
        const error = invalidEnvironmentSearchError
        return responseFailure(error)
      }
    }

    return await listEnvironments(this.httpClient, args)
  }

  /**
   * Creates a new environment within a project.
   * @param args - The arguments for creating an environment.
   * @param args.project - The name or id of the project to create the environment in.
   * @param args.name - The name of the new environment.
   * @returns A promise that resolves to the creation result or an error response.
   */
  async create(args: CreateEnvironmentArgs) {
    const { project, name } = args

    const projectIdentifierError = isValidProjectIdentifier(project)

    if (projectIdentifierError) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
    }

    if (!isValidEnvironmentName(name)) {
      const error = invalidNewEnvironmentNameError
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('environment', name)

    if (nameHasIdFormat) {
      const error = environmentNameUsesIdFormatError
      return responseFailure(error)
    }

    return await createEnvironment(this.httpClient, args)
  }

  /**
   * Removes an environment from a project.
   * @param args - The arguments for removing an environment.
   * @param args.environment - The name or id of the environment to remove.
   * @param args.project - The name or id of the project containing the environment.
   * @returns A promise that resolves to the removal result or an error response.
   */
  async remove(args: DeleteEnvironmentArgs) {
    const { environment, project } = args

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await deleteEnvironment(this.httpClient, args)
  }

  /**
   * Renames an environment within a project.
   * @param args - The arguments for renaming an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The current name or id of the environment.
   * @param args.newName - The new name for the environment.
   * @returns A promise that resolves to the rename result or an error response.
   */
  async rename(args: RenameEnvironmentArgs) {
    const { project, newName, environment } = args

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    if (!isValidEnvironmentName(newName)) {
      const error = invalidNewEnvironmentNameError
      return responseFailure(error)
    }

    const newNameHasIdFormat = isResourceIdFormat('environment', newName)

    if (newNameHasIdFormat) {
      const error = environmentNameUsesIdFormatError
      return responseFailure(error)
    }

    const environmentHasIdFormat = isResourceIdFormat('environment', environment)

    if (!environmentHasIdFormat && newName === environment) {
      const error = newEnvironmentNameEqualsOriginal
      return responseFailure(error)
    }

    return await renameEnvironment(this.httpClient, args)
  }

  /**
   * Duplicates an environment within a project.
   * @param args - The arguments for duplicating an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to duplicate.
   * @param args.duplicateName - The name for the new duplicate environment.
   * @returns A promise that resolves to the duplication result or an error response.
   */
  async duplicate(args: DuplicateEnvironmentArgs) {
    const { project, duplicateName, environment } = args

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    if (!isValidEnvironmentName(duplicateName)) {
      const error = invalidEnvironmentIdentifierError
      return responseFailure(error)
    }

    const duplicateNameHasIdFormat = isResourceIdFormat('environment', duplicateName)

    if (duplicateNameHasIdFormat) {
      const error = environmentNameUsesIdFormatError
      return responseFailure(error)
    }

    const environmentHasIdFormat = isResourceIdFormat('environment', environment)

    if (!environmentHasIdFormat && duplicateName === environment) {
      const error = newEnvironmentNameEqualsOriginal
      return responseFailure(error)
    }

    return await duplicateEnvironment(this.httpClient, args)
  }

  /**
   * Updates the type of an environment.
   * @param args - The arguments for updating the environment type.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to update.
   * @returns A promise that resolves to the update result or an error response.
   */
  async updateType(args: UpdateEnvironmentTypeArgs) {
    const { project, environment } = args

    const identifiersError = checkValidProjectEnv(project, environment)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await updateEnvironmentType(this.httpClient, args)
  }

  /**
   * Locks an environment to prevent modifications.
   * @param args - The arguments for locking an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to lock.
   * @returns A promise that resolves to the lock result or an error response.
   */
  async lock(args: LockEnvironmentArgs) {
    const { project, name } = args

    const identifiersError = checkValidProjectEnv(project, name)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await lockUnlockEnvironment(this.httpClient, args, true)
  }

  /**
   * Unlocks a previously locked environment.
   * @param args - The arguments for unlocking an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to unlock.
   * @returns A promise that resolves to the unlock result or an error response.
   */
  async unlock(args: LockEnvironmentArgs) {
    const { project, name } = args

    const identifiersError = checkValidProjectEnv(project, name)

    if (identifiersError) {
      return responseFailure(identifiersError)
    }

    return await lockUnlockEnvironment(this.httpClient, args, false)
  }
}
