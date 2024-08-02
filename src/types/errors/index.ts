import { ApiError } from '../../http/response'

export type SharedApiError =
  | UnauthorizedError
  | TooManyRequestsError
  | UnsupportedApiKeyError
  | ExpiredApiKeyError
  | MissingPermissionError
  | InternalServerError
  | ConnectionFailedError

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

type ExpiredApiKeyError = ApiError<'expired_api_key', { expiredAt: string }>
type UnsupportedApiKeyError = ApiError<'unsupported_api_key', { supportedApiKeyTypes: string[] }>

type TooManyRequestsError = ApiError<
  'too_many_requests',
  { retryAfter: { seconds: number; unixTimestamp: number } }
>
type UnauthorizedError = ApiError<'unauthorized', undefined>
type InternalServerError = ApiError<'internal_server_error', { requestId: string }>
type ConnectionFailedError = ApiError<'connection_failed', undefined>

export type ProjectNotFoundError = ApiError<'project_not_found'>
export type EnvironmentNotFoundError = ApiError<'environment_not_found'>
