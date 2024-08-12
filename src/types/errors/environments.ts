import { ConflictApiError, QuotaLimitApiError, ResourceApiError, ValidationApiError } from '.'

export type EnvironmentNotFoundError = ResourceApiError<'environment_not_found', undefined>
export type EnvironmentAlreadyExistsError = ConflictApiError<
  'environment_already_exists',
  undefined
>
export type EnvironmentLockedError = ConflictApiError<'environment_locked', undefined>
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
    example: {
      environmentNames: string[]
      environmentId: string
    }
  }
>

export type EnvironmentCannotUseIdFormatNameError = ValidationApiError<
  'environment_name_cannot_use_id_format',
  {
    example: {
      validEnvironmentNames: string[]
      invalidEnvironmentNames: string[]
    }
  }
>

export type InvalidNewEnvironmentNameError = ValidationApiError<'invalid_new_environment_name'>
export type NewEnvironmentNameEqualsOriginal =
  ValidationApiError<'new_environment_name_equals_original'>
