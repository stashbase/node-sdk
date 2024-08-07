import { ApiError, ApiErrorDetails } from '../../http/response'

export type AuthErrorCodePrefix = 'auth'
export type AccessErrorCodePrefix = 'access'
export type ResourceErrorCodePrefix = 'resource'
export type ValidationErrorCodePrefix = 'validation'
export type ConflictErrorCodePrefix = 'conflict'
export type QuotaLimitErrorCodePrefix = 'quota'
export type RateLimitErrorCodePrefix = 'rate_limit'
export type UnexpectedErrorCodePrefix = 'unexpected'

type ApiErrorDetailsGenericType = undefined | ApiErrorDetails

export type UnexpectedApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${UnexpectedErrorCodePrefix}.${T}`,
  D
>

export type AuthApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${AuthErrorCodePrefix}.${T}`,
  D
>

export type AccessApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${AccessErrorCodePrefix}.${T}`,
  D
>

export type ResourceApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${ResourceErrorCodePrefix}.${T}`,
  D
>

export type ValidationApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${ValidationErrorCodePrefix}.${T}`,
  D
>

export type ConflictApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${ConflictErrorCodePrefix}.${T}`,
  D
>

export type QuotaLimitApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${QuotaLimitErrorCodePrefix}.${T}`,
  D
>
export type RateLimitApiError<T extends string, D = ApiErrorDetailsGenericType> = ApiError<
  `${RateLimitErrorCodePrefix}.${T}`,
  D
>

export type GenericApiError =
  | UnauthorizedApiError
  | TooManyRequestsApiError
  | UnsupportedApiKeyError
  | ExpiredApiKeyError
  | MissingPermissionError
  | InternalServerError
  | ConnectionFailedError

type MissingPermissionError = AccessApiError<
  'missing_permission',
  {
    requiredPermissions?: string[]
    userWorkspaceRole?: {
      current: string
      allowed: string[]
    }
    projectRole?: {
      current: string
      allowed: string[]
    }
  }
>

type UnsupportedApiKeyError = AccessApiError<
  'unsupported_api_key',
  { supportedApiKeyTypes: string[] }
>
type ExpiredApiKeyError = AuthApiError<'expired_api_key', { expiredAt: string }>

type TooManyRequestsApiError = RateLimitApiError<
  'too_many_requests',
  { retryAfter: { seconds: number; unixTimestamp: number } }
>
type UnauthorizedApiError = AuthApiError<'unauthorized', undefined>

type InternalServerError = UnexpectedApiError<'internal_server_error', { requestId: string }>

export type ConnectionFailedError = UnexpectedApiError<'connection_failed', undefined>
export type ProjectNotFoundError = ResourceApiError<'project_not_found'>
export type EnvironmentNotFoundError = ResourceApiError<'environment_not_found'>
