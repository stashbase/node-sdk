import { ConflictApiError, ResourceApiError, ValidationApiError } from '.'

export type ProjectNotFoundError = ResourceApiError<'project_not_found', undefined>
export type ProjectLimitReachedError = ResourceApiError<'project_limit_reached', undefined>
export type ProjectAlreadyExistsError = ConflictApiError<'project_already_exists', undefined>
export type ProjectCannotUseIdFormatNameError = ValidationApiError<
  'project_name_cannot_use_id_format',
  {
    example: {
      validProjectNames: string[]
      invalidProjectNames: string[]
    }
  }
>

export type InvalidIdentifierProjectError = ValidationApiError<
  'invalid_project_identifier',
  {
    example: {
      projectNames: string[]
      projectId: string
    }
  }
>
