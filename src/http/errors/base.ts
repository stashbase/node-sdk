import { ApiError } from '../response'

export function createApiErrorFromResponse<T>(responseData: any): T {
  // validation error = bad request
  if (
    responseData &&
    responseData?.code === 'FST_ERR_VALIDATION' &&
    responseData?.statusCode === 400
  ) {
    return <T>{ code: 'bad_request' }
  }

  if (responseData && responseData.error) {
    return <T>{ code: responseData.error.code }
  }

  // If no error data is present, return a default APIError
  return <T>{ code: 'internal_error' }
}
