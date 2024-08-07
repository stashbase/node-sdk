import { ConflictApiError, QuotaLimitApiError, ResourceApiError } from '.'

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
