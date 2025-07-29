import { ApiError, ApiErrorDetails } from '../http/response'
import { ApiErrorType, ConnectionFailedError } from '../types/errors'
import {
  EnvironmentNameUsesIdFormatError,
  InvalidEnvironmentIdentifierError,
  InvalidEnvironmentNameError,
  InvalidEnvironmentOrderError,
  InvalidEnvironmentSearchError,
  InvalidEnvironmentSortByError,
  InvalidNewEnvironmentNameError,
  NewEnvironmentNameEqualsOriginal,
} from '../types/errors/environments'
import {
  InvalidIdentifierProjectError,
  InvalidNewProjectNameError,
  InvalidProjectLimitError,
  InvalidProjectPageNumberError,
  InvalidProjectByProjectError,
  ProjectNameUsesIdFormatError,
  InvalidProjectOrderError,
  InvalidProjectSearchError,
  InvalidProjectNameError,
  NewProjectNameEqualsOriginal,
} from '../types/errors/projects'

export function createApiErrorFromResponse<T>(responseData: unknown) {
  if (typeof responseData === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resData = responseData as { error?: ApiError<string, any> }
    if (resData && resData.error) {
      const error = new ApiError(
        resData.error.code,
        resData.error.details,
        resData.error.message
      ) as T

      return error
    }
  }

  return connectionFailedError
}

export const createApiError = <T extends string, D = undefined | ApiErrorDetails>(args: {
  code: T
  message: string
  details: D
}) => {
  // const error: ApiError<T, D> = {
  //   code: args.code,
  //   message: args.message,
  //   details: args.details,
  //   getType: () => {
  //     const splittedCode = args.code.split('.')
  //     const type = splittedCode[0] as ApiErrorType
  //     return type
  //   },

  const error = new ApiError(args.code, args.details, args.message)
  return error
}

const connectionFailedError: ConnectionFailedError = createApiError({
  code: 'server.connection_failed',
  message: 'Could not connect to the API server. Please try again later.',
  details: undefined,
})

export const invalidEnvironmentIdentifierError: InvalidEnvironmentIdentifierError = createApiError({
  code: 'validation.invalid_environment_identifier',
  details: {
    nameExamples: ['staging', 'dev_copy', 'api-prod'],
    idExample: 'env_2vKmcBluEENNfFKtXzrHBS',
  },
  message:
    "Invalid environment identifier. Either a name or Id can be used. The name must be alphanumeric, may include underscores (_) and one hyphen (-) as a separator, and must be between 2 and 40 characters long. The Id must start with the prefix 'env_' followd by 22 alphanumeric characters.",
})

export const invalidProjectIdentifierError: InvalidIdentifierProjectError = createApiError({
  code: 'validation.invalid_project_identifier',
  details: {
    nameExamples: ['my-project', 'booking-app-1', 'super_app'],
    idExample: 'proj_9Ve7ijuUMuwh9fb1j7CyBq',
  },
  message:
    "Invalid project identifier. Either a name or Id can be used. The name must be alphanumeric, may include underscores (_) and hyphens (-), and must be between 2 and 40 characters long. The Id must start with the prefix 'proj_' followed by 22 alphanumeric characters.",
})

export const newProjectNameEqualsOriginal: NewProjectNameEqualsOriginal = createApiError({
  code: 'validation.new_project_name_equals_original',
  message: 'The new project name cannot be the same as the original project name.',
  details: undefined,
})

export const projectNameUsesIdFormat: ProjectNameUsesIdFormatError = createApiError({
  code: 'validation.project_name_uses_id_format',
  message:
    "The provided project name appears to be in Id format. Please use a valid name format: alphanumeric, with optional underscores (_) and hyphens (-), between 2 and 40 characters long. Project names must not start with the prefix 'proj_' followed by 22 alphanumeric characters.",
  details: {
    validNameExamples: ['my-project', 'booking-app-1', 'super_app'],
    invalidNameExamples: ['proj_nVe7ijuUMuwh9fb1j7CyBq', 'proj_2vKmcBluEENNfFKtXzrHBS'],
  },
})

export const environmentNameUsesIdFormatError: EnvironmentNameUsesIdFormatError = createApiError({
  code: 'validation.environment_name_uses_id_format',
  message:
    "The provided environment name appears to be in Id format. Please use a valid name format: alphanumeric, with optional underscores (_) and a single hyphen (-) as a separator, between 2 and 40 characters long. Environment names must not start with the prefix 'env_' followed by 22 alphanumeric characters.",
  details: {
    validNameExamples: ['staging', 'dev_copy', 'api-prod'],
    invalidNameExamples: ['env_pTFmJBTuEENNfFKtXzrMQG', 'env_9Ve7ijuUMuwh9fb1j7CyBq'],
  },
})

export const invalidNewEnvironmentNameError: InvalidNewEnvironmentNameError = createApiError({
  code: 'validation.invalid_new_environment_name',
  message:
    'Environment name must be alphanumeric and may include underscores (_) and a single hyphen (-) as a separator, with a minimum of 2 and a maximum of 40 characters.',
  details: {
    validNameExamples: ['staging', 'dev_copy', 'api-prod'],
    invalidNameExamples: ['#dev', 'api-dev-1', 'service--dev'],
  },
})

export const invalidEnvironmentName: InvalidEnvironmentNameError = createApiError({
  code: 'validation.invalid_environment_name',
  message:
    'Environment name must be alphanumeric and may include underscores (_) and a single hyphen (-) as a separator, with a minimum of 2 and a maximum of 40 characters.',
  details: {
    validNameExamples: ['staging', 'dev_copy', 'api-prod'],
    invalidNameExamples: ['#dev', 'api-dev-1', 'service--dev'],
  },
})

export const newEnvironmentNameEqualsOriginal: NewEnvironmentNameEqualsOriginal = createApiError({
  code: 'validation.new_environment_name_equals_original',
  message: 'The new environment name cannot be the same as the original environment name.',
  details: undefined,
})

export const invalidNewProjectNameError: InvalidNewProjectNameError = createApiError({
  code: 'validation.invalid_new_project_name',
  message:
    'Project name must be alphanumeric and may include underscores (_) and hyphens (-), with a minimum of 2 and a maximum of 40 characters.',
  details: {
    validNameExamples: ['my-project', 'booking-app-1', 'super_app'],
    invalidNameExamples: ['super project', '#app-1', `joe's app`],
  },
})

export const invalidProjectName: InvalidProjectNameError = createApiError({
  code: 'validation.invalid_project_name',
  message:
    'Project name must be alphanumeric and may include underscores (_) and hyphens (-), with a minimum of 2 and a maximum of 40 characters.',
  details: {
    validNameExamples: ['my-project', 'booking-app-1', 'super_app'],
    invalidNameExamples: ['super project', '#app-1', `joe's app`],
  },
})

export const invalidProjectPageError: InvalidProjectPageNumberError = createApiError({
  code: 'validation.invalid_page',
  message: 'Page number must a number between 1 and 1000.',
  details: {
    min: 1,
    max: 1000,
    default: 1,
  },
})

export const invalidProjectLimitError: InvalidProjectLimitError = createApiError({
  code: 'validation.invalid_limit',
  message: 'Limit must be a number between 2 and 30, defaulting to 10.',
  details: {
    min: 2,
    max: 30,
    default: 10,
  },
})

export const invalidProjectSortByError: InvalidProjectByProjectError = createApiError({
  code: 'validation.invalid_sort_by',
  message: 'Sort by field must be one of: name, createdAt, or environmentCount.',
  details: {
    allowedValues: ['name', 'createdAt', 'environmentCount'],
  },
})

export const invalidProjectOrderError: InvalidProjectOrderError = createApiError({
  code: 'validation.invalid_order',
  message: 'Order must be either "asc" or "desc".',
  details: {
    allowedValues: ['asc', 'desc'],
  },
})

export const invalidProjectSearchError: InvalidProjectSearchError = createApiError({
  code: 'validation.invalid_search',
  // message: 'Invalid search query. Must be between 2 and 40 characters.',
  message:
    'Search value must be alphanumeric and may include underscores (_) and hyphens (-), with a minimum of 2 and a maximum of 40 characters.',
  details: {
    validSearchExamples: ['my-project', 'booking-app-1', 'super_app'],
    invalidSearchExamples: ['super project', '#app-1', `joe's app`],
  },
  // details: {
  //   minLength: 2,
  //   maxLength: 40,
  //
  // },
})

export const invalidEnvironmentSortByError: InvalidEnvironmentSortByError = createApiError({
  code: 'validation.invalid_sort_by',
  message: 'Sort by field must be one of: name or createdAt or secretCount. Defaulting to name.',
  details: {
    allowedValues: ['name', 'createdAt', 'secretCount'],
  },
})

export const invalidEnvironmentOrderError: InvalidEnvironmentOrderError = createApiError({
  code: 'validation.invalid_order',
  message: 'Order must be either "asc" or "desc".',
  details: {
    allowedValues: ['asc', 'desc'],
  },
})

export const invalidEnvironmentSearchError: InvalidEnvironmentSearchError = createApiError({
  code: 'validation.invalid_search',
  message:
    'Search value must be alphanumeric and may include underscores (_) and a single hyphen (-) as a separator, with a minimum of 2 and a maximum of 40 characters.',
  details: {
    validSearchExamples: ['staging', 'dev_copy', 'api-prod'],
    invalidSearchExamples: ['#dev', 'api-dev-1', 'service--dev'],
  },
})
