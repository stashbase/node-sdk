import { ApiError } from '../response'

export function createApiErrorFromResponse<T>(responseData: {
  code?: string
  statusCode?: number
  error: ApiError<unknown>
}): T {
  // validation error = bad request
  if (responseData && responseData?.statusCode === 400) {
    return <T>{ code: 'bad_request' }
  }

  if (responseData?.statusCode === 429) {
    return <T>{ code: 'too_many_requests', details: responseData?.message ?? undefined }
  }

  if (responseData && responseData.error) {
    return <T>{
      code: responseData?.error?.code,
      details: responseData?.error?.details ?? undefined,
    }
  }

  // If no error data is present, return a default APIErroR
  return <T>{ code: 'server_error' }
}
