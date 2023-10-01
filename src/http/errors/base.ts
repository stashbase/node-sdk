import { ApiError } from '../response'

export function createApiErrorFromResponse(responseData: any): ApiError {
  if (responseData && responseData.error) {
    const err: ApiError = { code: responseData.error.code }
    return err
  }

  // If no error data is present, return a default APIError
  return { code: 'internal_error' }
}
