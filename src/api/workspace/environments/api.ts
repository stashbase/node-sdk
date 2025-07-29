import { HttpClient } from '../../../http/client'
import {
  environmentNameUsesIdFormatError,
  invalidEnvironmentIdentifierError,
  invalidEnvironmentOrderError,
  invalidEnvironmentSearchError,
  invalidEnvironmentSortByError,
  invalidEnvironmentName,
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
import { getEnvironment } from './handlers/get'
import { listEnvironments } from './handlers/list'
import { loadEnvironment } from './handlers/load'
import { renameEnvironment } from './handlers/rename'
import { setIsProduction } from './handlers/setIsProduction'
import { responseFailure } from '../../../http/response'
import {
  CreateEnvironmentData,
  ListEnvironmentOptions,
  LoadEnvironmentOptions,
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

    if (envNameOrId !== undefined && !isValidEnvironmentIdentifier(envNameOrId)) {
      const error = invalidEnvironmentIdentifierError
      return error
    }
  }

  /**
   * Retrieves an environment by its name within a project.
   * @param envNameOrId - The name or id of the environment to retrieve.
   * @returns A promise that resolves to the environment data or an error response.
   */
  async get(envNameOrId: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await getEnvironment({ ...this.getHandlerArgs(), environment: envNameOrId })
  }

  /**
   * Loads an environment and injects its secrets into the process, throwing an error if it fails.
   * @param envNameOrId - The name or id of the environment to load.
   * @param options - Additional options for loading the environment.
   * @throws Error with the error code if loading fails.
   * @returns A promise that resolves to null if successful.
   */
  async loadOrThrow(envNameOrId: string, options?: LoadEnvironmentOptions) {
    if (options?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    const { error } = await loadEnvironment({
      ...this.getHandlerArgs(),
      environment: envNameOrId,
      options,
    })

    // throws only error code
    if (error) {
      throw new Error(error?.code)
    }
  }

  /**
   * Loads an environment and injects its secrets into the process.
   * @param envNameOrId - The name or id of the environment to load.
   * @param options - Additional options for loading the environment.
   * @returns A promise that resolves to null if successful or and error response.
   */
  async load(envNameOrId: string, options?: LoadEnvironmentOptions) {
    if (options?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await loadEnvironment({ ...this.getHandlerArgs(), environment: envNameOrId, options })
  }

  /**
   * Lists all environments within a project.
   * @param options - Options for listing environments.
   * @returns A promise that resolves to an array of environments or an error response.
   */
  async list(options?: ListEnvironmentOptions) {
    const identifiersError = this.validateIdentifiers()
    if (identifiersError) return responseFailure(identifiersError)

    if (options?.sortBy) {
      const sortBy = options.sortBy

      if (sortBy !== 'name' && sortBy !== 'createdAt' && sortBy !== 'secretCount') {
        const error = invalidEnvironmentSortByError
        return responseFailure(error)
      }
    }

    if (options?.order) {
      const order = options.order

      if (order !== 'asc' && order !== 'desc') {
        const error = invalidEnvironmentOrderError
        return responseFailure(error)
      }
    }

    if (options?.search) {
      if (!isValidEnvironmentName(options.search)) {
        const error = invalidEnvironmentSearchError
        return responseFailure(error)
      }
    }

    return await listEnvironments({ ...this.getHandlerArgs(), options })
  }

  /**
   * Creates a new environment within a project.
   * @param data - The data for creating the environment.
   * @returns A promise that resolves to the creation result or an error response.
   */
  async create(data: CreateEnvironmentData) {
    const validationError = this.validateIdentifiers()
    if (validationError) return responseFailure(validationError)

    if (!isValidEnvironmentName(data.name)) {
      const error = invalidEnvironmentName
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
   * @param envNameOrId - The name or id of the environment to remove.
   * @returns A promise that resolves to the removal result or an error response.
   */
  async delete(envNameOrId: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await deleteEnvironment({ ...this.getHandlerArgs(), environment: envNameOrId })
  }

  /**
   * Renames an environment within a project.
   * @param envNameOrId - The current name or id of the environment.
   * @param newName - The new name for the environment.
   * @returns A promise that resolves to the rename result or an error response.
   */
  async rename(envNameOrId: string, newName: string) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    if (!isValidEnvironmentName(newName)) {
      const error = invalidEnvironmentName
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

    return await renameEnvironment({ ...this.getHandlerArgs(), environment: envNameOrId, newName })
  }

  /**
   * Mark the environment as a production or non-production environment.
   * @param envNameOrId - The name or id of the environment to update.
   * @param isProduction - Whether the environment is a production environment or not.
   * @returns A promise that resolves to the update result or an error response.
   */
  async setIsProduction(envNameOrId: string, isProduction: boolean) {
    const identifiersError = this.validateIdentifiers(envNameOrId)
    if (identifiersError) return responseFailure(identifiersError)

    return await setIsProduction({
      ...this.getHandlerArgs(),
      environment: envNameOrId,
      isProduction,
    })
  }
}
