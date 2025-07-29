import { ConflictApiError, QuotaLimitApiError, ResourceApiError, ValidationApiError } from '.'

export type EnvironmentNotFoundError = ResourceApiError<'environment_not_found', undefined>
export type EnvironmentAlreadyExistsError = ConflictApiError<
  'environment_already_exists',
  undefined
>
export type EnvironmentLimitReachedError = QuotaLimitApiError<
  'environment_limit_reached',
  undefined
>

export type ProjectCannotUseIdFormatNameError = ValidationApiError<
  'environment_name_cannot_use_id_format',
  {
    example: {
      validEnvironmentNames: string[]
      invaliEnvironmentNames: string[]
    }
  }
>

export type InvalidEnvironmentIdentifierError = ValidationApiError<
  'invalid_environment_identifier',
  {
    nameExamples: string[]
    idExample: string
  }
>

export type EnvironmentNameUsesIdFormatError = ValidationApiError<
  'environment_name_uses_id_format',
  {
    invalidNameExamples: string[]
    validNameExamples: string[]
  }
>

export type InvalidEnvironmentNameError = ValidationApiError<
  'invalid_environment_name',
  {
    validNameExamples: string[]
    invalidNameExamples: string[]
  }
>

export type NewEnvironmentNameEqualsOriginal =
  ValidationApiError<'new_environment_name_equals_original'>

export type InvalidEnvironmentSortByError = ValidationApiError<
  'invalid_sort_by',
  {
    allowedValues: Array<string>
  }
>

export type InvalidEnvironmentOrderError = ValidationApiError<
  'invalid_order',
  {
    allowedValues: Array<string>
  }
>

export type InvalidEnvironmentSearchError = ValidationApiError<
  'invalid_search',
  {
    validSearchExamples: string[]
    invalidSearchExamples: string[]
  }
>
