export type ApiError<T> = {
  code: T | 'server_error' | 'bad_request'
  // message: string
  // details: string
  // hint: strinG
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

export type ApiResponse<T, K extends { code: string }> = ResponseSuccess<T> | ResponseFailure<K>
