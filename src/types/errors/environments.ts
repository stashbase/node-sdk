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
