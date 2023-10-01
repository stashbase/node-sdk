import { ApiError } from '../response'

export function createApiErrorFromResponse<T>(responseData: any): T {
  if (responseData && responseData.error) {
    return <T>{ code: responseData.error.code }
  }

  // If no error data is present, return a default APIError
  return <T>{ code: 'internal_error' }
}
