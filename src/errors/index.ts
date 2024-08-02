import { ApiError, ApiErrorDetails } from '../http/response'

export function createApiErrorFromResponse<T>(responseData: unknown): T {
  if (typeof responseData === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resData = responseData as { error?: ApiError<string, any> }
    if (resData && resData.error) {
      return <T>{
        code: resData?.error?.code,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        details: resData?.error?.details ?? undefined,
        message: resData?.error?.message,
      }
    }
  }

  return <T>{ code: 'server_error', message: 'Something went wrong. Please try again later.' }
}

export const createApiError = <T extends string, D = undefined | ApiErrorDetails>(args: {
  code: T
  message: string
  details: D
}) => {
  const error: ApiError<T, D> = {
    code: args.code,
    message: args.message,
    details: args.details,
  }

  return error
}

export const invalidEnvironmentNameError = createApiError({
  code: 'invalid_environment_name',
  details: {
    exampleProjectNames: ['my-project', 'booking-app-1', 'super_app'],
  },
  message:
    'Environment name must be alphanumeric, only underscores or hyphen separator allowed, min 2 and max 255 characters.',
})

export const invalidProjectNameError = createApiError({
  code: 'invalid_project_name',
  details: {
    exampleEnvironmentNames: ['staging', 'dev_copy', 'api-prod'],
  },
  message:
    'Project name must be alphanumeric, only hyphens and underscores allowed, min 2 and max 255 characters.',
})
