import { invalidEnvironmentIdentifierError, invalidProjectIdentifierError } from '../../../errors'
import {
  invalidChangelogChangeIdError,
  invalidChangelogLimitError,
  invalidChangelogPageError,
} from '../../../errors/changelog'
import { HttpClient } from '../../../http/client'
import { ApiResponse, responseFailure } from '../../../http/response'
import { ListChangelogOptions, ListChangelogResponse } from '../../../types/changelog'
import { InvalidEnvironmentIdentifierError } from '../../../types/errors/environments'
import { InvalidIdentifierProjectError } from '../../../types/errors/projects'
import {
  isValidChangelogChangeId,
  isValidEnvironmentIdentifier,
  isValidProjectIdentifier,
} from '../../../utils/inputValidation'
import { getChangelogChange } from './handlers/get'
import { listChangelog, ListChangelogError } from './handlers/list'
import { revertChangelogChange } from './handlers/revert'

export class ChangelogAPI {
  private httpClient: HttpClient
  public project: string
  public environment: string

  public constructor(httpClient: HttpClient, project: string, environment: string) {
    this.httpClient = httpClient
    this.project = project
    this.environment = environment
  }

  private getHandlerArgs() {
    return { client: this.httpClient, project: this.project, environment: this.environment }
  }

  private validateIdentifiers(changeId?: string) {
    const { project, environment } = this

    if (!isValidProjectIdentifier(project)) {
      const error = invalidProjectIdentifierError
      return error
    }

    if (!isValidEnvironmentIdentifier(environment)) {
      const error = invalidEnvironmentIdentifierError
      return error
    }

    if (changeId !== undefined && !isValidChangelogChangeId(changeId)) {
      const error = invalidChangelogChangeIdError
      return error
    }
  }

  /**
   * Lists the changelog items.
   *
   * @param withValues - Whether to include values in the changelog items.
   * @param options - Options for listing the changelog items.
   * @returns A promise that resolves to the list of changelog items or an error response.
   */
  public async list<T extends boolean | undefined = undefined>(
    withValues?: T,
    options?: ListChangelogOptions
  ): Promise<ApiResponse<ListChangelogResponse<T>, ListChangelogError>> {
    const validationError = this.validateIdentifiers()

    if (validationError)
      return responseFailure(
        validationError as InvalidIdentifierProjectError | InvalidEnvironmentIdentifierError
      )

    if (options) {
      if (
        options.page !== undefined &&
        (options.page <= 0 || options.page > 1000 || typeof options.page !== 'number')
      ) {
        const error = invalidChangelogPageError
        return responseFailure(error)
      }

      if (
        options.limit !== undefined &&
        (options.limit < 2 || options.limit > 10 || typeof options.limit !== 'number')
      ) {
        const error = invalidChangelogLimitError
        return responseFailure(error)
      }
    }

    return listChangelog({ ...this.getHandlerArgs(), client: this.httpClient, withValues, options })
  }

  /**
   * Retrieves a specific changelog item by its ID.
   *
   * @param changeId - The ID of the changelog item to retrieve.
   * @returns A promise that resolves to the changelog item or an error response.
   */
  public async get(changeId: string) {
    const validationError = this.validateIdentifiers(changeId)
    if (validationError) return responseFailure(validationError)

    return getChangelogChange({ ...this.getHandlerArgs(), client: this.httpClient, changeId })
  }

  /**
   * Revert change (secrets) by its ID.
   *
   * @param changeId - The ID of the changelog item to revert.
   * @returns A promise that resolves to null on success or an error response.
   */
  public async revert(changeId: string) {
    const validationError = this.validateIdentifiers(changeId)
    if (validationError) return responseFailure(validationError)

    return revertChangelogChange({ ...this.getHandlerArgs(), client: this.httpClient, changeId })
  }
}
