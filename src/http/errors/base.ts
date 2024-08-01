import { ApiError } from '../response'

export function createApiErrorFromResponse<T>(responseData: { error: ApiError<any, any> }): T {
  if (responseData && responseData.error) {
    return <T>{
      code: responseData?.error?.code,
      details: responseData?.error?.details ?? undefined,
      message: responseData?.error?.message,
    }
  }

  return <T>{ code: 'server_error' }
}
