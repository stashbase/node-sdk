import { ApiError, ApiErrorDetails } from '../http/response'
import { ConnectionFailedError } from '../types/errors'

export function createApiErrorFromResponse<T>(responseData: unknown) {
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

  return connectionFailedError
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

const connectionFailedError: ConnectionFailedError = createApiError({
  code: 'unexpected.connection_failed',
  message: 'Could not connect to the API server. Please try again later.',
  details: undefined,
})

export const invalidEnvironmentNameError = createApiError({
  code: 'validation.invalid_environment_identifier',
  details: {
    example: {
      environmentNames: ['staging', 'dev_copy', 'api-prod'],
      environmentId: 'ev_2vKmcBluEENNfFKtXzrHBS',
    },
  },
  message:
    "Invalid environment identifier. Either name or Id can be used. The name must be alphanumeric, may include one hyphen as a separator and underscores, and must be between 2 and 255 characters long. The Id must start with the prefix 'ev_' and be exactly 25 characters long, consisting of alphanumeric characters.",
})

export const invalidProjectNameError = createApiError({
  code: 'validation.invalid_project_identifier',
  details: {
    example: {
      projectNames: ['my-project', 'booking-app-1', 'super_app'],
      projectId: 'pr_9Ve7ijuUMuwh9fb1j7CyBq',
    },
  },
  message:
    "Invalid project identifier. Either name or Id can be used. The name must be alphanumeric, may include hyphens and underscores, and must be between 2 and 255 characters long. The Id must start with the prefix 'pr_' and be exactly 25 characters long, consisting of alphanumeric characters.",
})
