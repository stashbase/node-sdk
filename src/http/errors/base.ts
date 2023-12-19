import { ApiError } from '../response'

export function createApiErrorFromResponse<T>(responseData: {
  code?: string
  statusCode?: number
  error: ApiError<unknown>
}): T {
  // validation error = bad request
  if (
    responseData &&
    responseData?.code === 'FST_ERR_VALIDATION' &&
    responseData?.statusCode === 400
  ) {
    return <T>{ code: 'bad_request', details: responseData?.error?.details }
  }

  if (responseData && responseData.error) {
    return <T>{ code: responseData.error.code, details: responseData.error.details }
  }

  // If no error data is present, return a default APIErroR
  return <T>{ code: 'server_error' }
}
