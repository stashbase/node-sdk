import { ApiError } from '../../http/response'

export type EnvironmentNotFoundError = ApiError<'environment_not_found', undefined>
export type EnvironmentAlreadyExistsError = ApiError<'environment_already_exists', undefined>
export type EnvironmentLockedError = ApiError<'environment_locked', undefined>
export type EnvironmentLimitReachedError = ApiError<'environment_limit_reached', undefined>
