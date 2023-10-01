export type ApiError = {
  code: string
  // message: string
  // details: string
  // hint: strinG
}

interface ResponseSuccess<T> {
  error: null
  data: T
}
interface ResponseFailure {
  error: ApiError
  data: null
  // For backward compatibility: body === data
}

export type ApiResponse<T> = ResponseSuccess<T> | ResponseFailure
