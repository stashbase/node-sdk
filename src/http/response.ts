/**
 * Api error with the specified code and optional details.
 * @param code - The error code.
 * @param details - Optional details for the error.
 */
export type ApiError<T = void, K extends string | object | void = void> = T extends void
  ? {
      code:
        | 'too_many_requests'
        | 'unauthorized'
        | 'api_key_expired'
        | 'missing_permission'
        | 'server_error'
        | 'bad_request'
    }
  : {
      code:
        | T
        | 'too_many_requests'
        | 'unauthorized'
        | 'api_key_expired'
        | 'missing_permission'
        | 'server_error'
        | 'bad_request'
      details?: K
      // message: string
      // details: string
      // hint: strin
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
export type ApiResponse<T, K = void> = ResponseSuccess<T> | ResponseFailure<K>
