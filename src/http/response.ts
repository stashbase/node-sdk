export type SharedApiError =
  | UnauthorizedError
  | TooManyRequestsError
  | ApiKeyUnsupportedError
  | ApiKeyExpiredError
  | MissingPermissionError
  | ServerError

type MissingPermissionError = ApiError<
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

type ApiKeyExpiredError = ApiError<'api_key_expired', { expiredAt: string }>
type ApiKeyUnsupportedError = ApiError<'api_key_unsupported', { supportedApiKeyTypes: string[] }>

type TooManyRequestsError = ApiError<
  'too_many_requests',
  { retryAfter: { seconds: number; unixTimestamp: number } }
>
type UnauthorizedError = ApiError<'unauthorized', undefined>
type ServerError = ApiError<'server_error', undefined>

export type ProjectNotFoundError = ApiError<'project_not_found'>
export type EnvironmentNotFoundError = ApiError<'environment_not_found'>

export type ApiErrorDetails = Record<string, { [key: string]: object }>

/**
 * Api error with the specified code and optional details.
 * @param code - The error code.
 * @param details - Optional details for the error.
 * @param message - Message describing the error.
 */
export type ApiError<T extends string, D = undefined | ApiErrorDetails> = {
  code: T
  details: D
  message: string
}

interface ResponseSuccess<T> {
  ok: true
  error: null
  data: T
}
interface ResponseFailure<K> {
  ok: false
  error: K
  data: null
  // For backward compatibility: body === data
}

// export type ApiResponse<T, K extends { code: string }> = ResponseSuccess<T> | ResponseFailure<K>
export type ApiResponse<T, K = undefined> = ResponseSuccess<T> | ResponseFailure<K>

export const responseSuccess = <T>(data: T): ResponseSuccess<T> => {
  return {
    ok: true,
    error: null,
    data,
  }
}

export const responseFailure = <K>(error: K): ResponseFailure<K> => {
  return {
    ok: false,
    data: null,
    error,
  }
}
