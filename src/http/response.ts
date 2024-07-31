export type SharedApiError =
  | ApiKeyExpiredError
  | MissingPermissionError
  | TooManyRequestsError
  | UnauthorizedError
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

type TooManyRequestsError = ApiError<'too_many_requests'>
type UnauthorizedError = ApiError<'unauthorized'>
type ServerError = ApiError<'server_error'>

export type ProjectNotFoundError = ApiError<'project_not_found'>
export type EnvironmentNotFoundError = ApiError<'environment_not_found'>

export type ApiErrorDetails = Record<string, { [key: string]: object }>

/**
 * Api error with the specified code and optional details.
 * @param code - The error code.
 * @param details - Optional details for the error.
 */
export type ApiError<T extends string, D = undefined | ApiErrorDetails> = {
  code: T
  details: D
}

interface ResponseSuccess<T> {
  error: null
  data: T
}
interface ResponseFailure<K> {
  error: K
  data: null
  // For backward compatibility: body === data
}

// export type ApiResponse<T, K extends { code: string }> = ResponseSuccess<T> | ResponseFailure<K>
export type ApiResponse<T, K = undefined> = ResponseSuccess<T> | ResponseFailure<K>
