import { ConflictApiError, ResourceApiError, ValidationApiError } from '.'

export type ProjectNotFoundError = ResourceApiError<'project_not_found', undefined>
export type ProjectLimitReachedError = ResourceApiError<'project_limit_reached', undefined>
export type ProjectAlreadyExistsError = ConflictApiError<'project_already_exists', undefined>
export type ProjectNameUsesIdFormatError = ValidationApiError<
  'project_name_uses_id_format',
  {
    invalidNameExamples: string[]
    validNameExamples: string[]
  }
>

export type InvalidIdentifierProjectError = ValidationApiError<
  'invalid_project_identifier',
  {
    nameExamples: string[]
    idExample: string
  }
>

export type InvalidNewProjectNameError = ValidationApiError<
  'invalid_new_project_name',
  {
    validNameExamples: string[]
    invalidNameExamples: string[]
  }
>

export type ProjectDescriptionTooLongError = ValidationApiError<
  'project_description_too_long',
  {
    maxLength: number
  }
>

export type InvalidProjectPageNumberError = ValidationApiError<
  'invalid_page',
  {
    min: number
    max: number
  }
>

export type InvalidProjectLimitError = ValidationApiError<
  'invalid_limit',
  {
    min: number
    max: number
  }
>

export type InvalidProjectByProjectError = ValidationApiError<
  'invalid_sort_by',
  {
    allowedValues: Array<string>
  }
>

export type InvalidProjectOrderError = ValidationApiError<
  'invalid_order',
  {
    allowedValues: Array<string>
  }
>

export type InvalidProjectSearchError = ValidationApiError<
  'invalid_search',
  {
    // minLength: number
    // maxLength: number
    validSearchExamples: string[]
    invalidSearchExamples: string[]
  }
>
