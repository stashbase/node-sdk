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
import { listChangelog, ListChangelogError } from './handlers/list'
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
        (options.page !== undefined && (options.page <= 0 || options.page > 1000)) ||
        typeof options.page !== 'number'
      ) {
        const error = invalidChangelogPageError
        return responseFailure(error)
      }

      if (
        (options.limit !== undefined && (options.limit < 2 || options.limit > 10)) ||
        typeof options.limit !== 'number'
      ) {
        const error = invalidChangelogLimitError
        return responseFailure(error)
      }
    }

    return listChangelog({ ...this.getHandlerArgs(), client: this.httpClient, withValues, options })
  }
}
