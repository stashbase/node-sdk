import { invalidEnvironmentIdentifierError, invalidProjectIdentifierError } from '../../../errors'
import { HttpClient } from '../../../http/client'
import {
  isValidChangelogChangeId,
  isValidEnvironmentIdentifier,
  isValidProjectIdentifier,
} from '../../../utils/inputValidation'
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
}
