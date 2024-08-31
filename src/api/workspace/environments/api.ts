import { HttpClient } from '../../../http/client'
import {
  environmentNameUsesIdFormatError,
  invalidEnvironmentIdentifierError,
  invalidEnvironmentOrderError,
  invalidEnvironmentSearchError,
  invalidEnvironmentSortByError,
  invalidNewEnvironmentNameError,
  invalidProjectIdentifierError,
  newEnvironmentNameEqualsOriginal,
} from '../../../errors'
import {
  isResourceIdFormat,
  isValidEnvironmentIdentifier,
  isValidEnvironmentName,
  isValidProjectIdentifier,
} from '../../../utils/inputValidation'
import { createEnvironment } from './handlers/create'
import { deleteEnvironment } from './handlers/delete'
import { duplicateEnvironment } from './handlers/duplicate'
import { getEnvironment } from './handlers/get'
import { listEnvironments } from './handlers/list'
import { loadEnvironment } from './handlers/load'
import { lockUnlockEnvironment } from './handlers/lock'
import { renameEnvironment } from './handlers/rename'
import { updateEnvironmentType } from './handlers/updateType'
import { responseFailure } from '../../../http/response'
import {
  CreateEnvironmentData,
  ListEnvironmentOptions,
  LoadEnvironmentOpts,
} from '../../../types/environments'

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
  private httpClient: HttpClient
  public project: string

  constructor(httpClient: HttpClient, project: string) {
    this.httpClient = httpClient
    this.project = project
  }

  private getHandlerArgs() {
    return { client: this.httpClient, project: this.project }
  }

  private validateIdentifiers(envNameOrId?: string) {
    const { project } = this

    if (!isValidProjectIdentifier(project)) {
      const error = invalidProjectIdentifierError
      return error
    }

    if (envNameOrId && !isValidEnvironmentIdentifier(envNameOrId)) {
      const error = invalidEnvironmentIdentifierError
      return error
    }
  }

  /**
   * Retrieves an environment by its name within a project.
   * @param args - The arguments for getting an environment.
   * @param args.environment - The name or id of the environment to retrieve.
   * @param args.project -project The name or the id of the project containing the environment.
   * @returns A promise that resolves to the environment data or an error response.
   */
  async get(envNameOrId: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await getEnvironment({ ...this.getHandlerArgs(), envNameOrId })
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
  async loadOrThrow(envNameOrId: string, opts?: LoadEnvironmentOpts) {
    if (opts?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    const { error } = await loadEnvironment({ ...this.getHandlerArgs(), envNameOrId, opts })

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
  async load(envNameOrId: string, opts?: LoadEnvironmentOpts) {
    if (opts?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await loadEnvironment({ ...this.getHandlerArgs(), envNameOrId, opts })
  }

  /**
   * Lists all environments within a project.
   * @param args - The arguments for listing environments.
   * @param args.project - The name or id of the project to list environments from.
   * @returns A promise that resolves to an array of environments or an error response.
   */
  async list(opts?: ListEnvironmentOptions) {
    const identifiersError = this.validateIdentifiers()
    if (identifiersError) return responseFailure(identifiersError)

    if (opts?.sortBy) {
      const sortBy = opts.sortBy

      if (sortBy !== 'name' && sortBy !== 'createdAt' && sortBy !== 'secretCount') {
        const error = invalidEnvironmentSortByError
        return responseFailure(error)
      }
    }

    if (opts?.order) {
      const order = opts.order

      if (order !== 'asc' && order !== 'desc') {
        const error = invalidEnvironmentOrderError
        return responseFailure(error)
      }
    }

    if (opts?.search) {
      if (!isValidEnvironmentName(opts.search)) {
        const error = invalidEnvironmentSearchError
        return responseFailure(error)
      }
    }

    return await listEnvironments({ ...this.getHandlerArgs(), opts })
  }

  /**
   * Creates a new environment within a project.
   * @param args - The arguments for creating an environment.
   * @param args.project - The name or id of the project to create the environment in.
   * @param args.name - The name of the new environment.
   * @returns A promise that resolves to the creation result or an error response.
   */
  async create(data: CreateEnvironmentData) {
    const validationError = this.validateIdentifiers()
    if (validationError) return responseFailure(validationError)

    if (!isValidEnvironmentName(data.name)) {
      const error = invalidNewEnvironmentNameError
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('environment', data.name)

    if (nameHasIdFormat) {
      const error = environmentNameUsesIdFormatError
      return responseFailure(error)
    }

    return await createEnvironment({ ...this.getHandlerArgs(), data })
  }

  /**
   * Deletes an environment from a project.
   * @param args - The arguments for removing an environment.
   * @param args.environment - The name or id of the environment to remove.
   * @param args.project - The name or id of the project containing the environment.
   * @returns A promise that resolves to the removal result or an error response.
   */
  async delete(envNameOrId: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await deleteEnvironment({ ...this.getHandlerArgs(), envNameOrId })
  }

  /**
   * Renames an environment within a project.
   * @param args - The arguments for renaming an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The current name or id of the environment.
   * @param args.newName - The new name for the environment.
   * @returns A promise that resolves to the rename result or an error response.
   */
  async rename(envNameOrId: string, newName: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    if (!isValidEnvironmentName(newName)) {
      const error = invalidNewEnvironmentNameError
      return responseFailure(error)
    }

    const newNameHasIdFormat = isResourceIdFormat('environment', newName)

    if (newNameHasIdFormat) {
      const error = environmentNameUsesIdFormatError
      return responseFailure(error)
    }

    const environmentHasIdFormat = isResourceIdFormat('environment', envNameOrId)

    if (!environmentHasIdFormat && newName === envNameOrId) {
      const error = newEnvironmentNameEqualsOriginal
      return responseFailure(error)
    }

    return await renameEnvironment({ ...this.getHandlerArgs(), envNameOrId, newName })
  }

  /**
   * Duplicates an environment within a project.
   * @param args - The arguments for duplicating an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to duplicate.
   * @param args.duplicateName - The name for the new duplicate environment.
   * @returns A promise that resolves to the duplication result or an error response.
   */
  async duplicate(envNameOrId: string, duplicateName: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    if (!isValidEnvironmentName(duplicateName)) {
      const error = invalidEnvironmentIdentifierError
      return responseFailure(error)
    }

    const duplicateNameHasIdFormat = isResourceIdFormat('environment', duplicateName)

    if (duplicateNameHasIdFormat) {
      const error = environmentNameUsesIdFormatError
      return responseFailure(error)
    }

    const environmentHasIdFormat = isResourceIdFormat('environment', envNameOrId)

    if (!environmentHasIdFormat && duplicateName === envNameOrId) {
      const error = newEnvironmentNameEqualsOriginal
      return responseFailure(error)
    }

    return await duplicateEnvironment({ ...this.getHandlerArgs(), envNameOrId, duplicateName })
  }

  /**
   * Updates the type of an environment.
   * @param args - The arguments for updating the environment type.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to update.
   * @returns A promise that resolves to the update result or an error response.
   */
  async updateType(
    envNameOrId: string,
    type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  ) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await updateEnvironmentType({
      ...this.getHandlerArgs(),
      envNameOrId,
      type,
    })
  }

  /**
   * Locks an environment to prevent modifications.
   * @param args - The arguments for locking an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to lock.
   * @returns A promise that resolves to the lock result or an error response.
   */
  async lock(envNameOrId: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await lockUnlockEnvironment({ ...this.getHandlerArgs(), envNameOrId, lock: true })
  }

  /**
   * Unlocks a previously locked environment.
   * @param args - The arguments for unlocking an environment.
   * @param args.project - The name or id of the project containing the environment.
   * @param args.name - The name or id of the environment to unlock.
   * @returns A promise that resolves to the unlock result or an error response.
   */
  async unlock(envNameOrId: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await lockUnlockEnvironment({ ...this.getHandlerArgs(), envNameOrId, lock: true })
  }
}
