import { ApiError, ApiErrorDetails } from '../http/response'

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
  details: undefined,
  message:
    'Environment name must be alphanumeric, only underscores or hyphen separator allowed, min 2 and max 255 characters.',
})

export const invalidProjectNameError = createApiError({
  code: 'invalid_project_name',
  details: undefined,
  message:
    'Project name must be alphanumeric, only hyphens and underscores allowed, min 2 and max 255 characters.',
})
