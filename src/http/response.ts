type SharedApiErrorCode =
  | 'too_many_requests'
  | 'unauthorized'
  | 'api_key_expired'
  | 'missing_permission'
  | 'server_error'
  | 'bad_request'

export type ApiErrorDetails = Record<string, { [key: string]: object }>

/**
 * Api error with the specified code and optional details.
 * @param code - The error code.
 * @param details - Optional details for the error.
 */
export type ApiError<T extends string, D = undefined | ApiErrorDetails> = {
  code: SharedApiErrorCode | T
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
