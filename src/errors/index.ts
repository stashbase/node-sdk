import { ApiError, ApiErrorDetails } from '../http/response'
import { ConnectionFailedError } from '../types/errors'
import {
  EnvironmentNameUsesIdFormatError,
  InvalidEnvironmentIdentifierError,
  InvalidNewEnvironmentNameError,
  NewEnvironmentNameEqualsOriginal,
} from '../types/errors/environments'
import {
  InvalidIdentifierProjectError,
  InvalidNewProjectNameError,
  ProjectNameUsesIdFormatError,
} from '../types/errors/projects'

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

export const invalidEnvironmentIdentifierError: InvalidEnvironmentIdentifierError = createApiError({
  code: 'validation.invalid_environment_identifier',
  details: {
    nameExamples: ['staging', 'dev_copy', 'api-prod'],
    idExample: 'ev_2vKmcBluEENNfFKtXzrHBS',
  },
  message:
    "Invalid environment identifier. Either name or Id can be used. The name must be alphanumeric, may include one hyphen as a separator and underscores, and must be between 2 and 255 characters long. The Id must start with the prefix 'ev_' and be exactly 25 characters long, consisting of alphanumeric characters.",
})

export const invalidProjectIdentifierError: InvalidIdentifierProjectError = createApiError({
  code: 'validation.invalid_project_identifier',
  details: {
    nameExamples: ['my-project', 'booking-app-1', 'super_app'],
    idExample: 'pr_9Ve7ijuUMuwh9fb1j7CyBq',
  },
  message:
    "Invalid project identifier. Either name or Id can be used. The name must be alphanumeric, may include hyphens and underscores, and must be between 2 and 255 characters long. The Id must start with the prefix 'pr_' and be exactly 25 characters long, consisting of alphanumeric characters.",
})

export const projectNameUsesIdFormat: ProjectNameUsesIdFormatError = createApiError({
  code: 'validation.project_name_uses_id_format',
  message:
    "The provided project name is using an Id format. Please ensure the name is in a valid format: alphanumeric, with hyphens and underscores, and without the prefix 'pr_'. Names must adhere to the length constraints of 2 to 255 characters and cannot resemble Ids.",
  details: {
    validNameExamples: ['my-project', 'booking-app-1', 'super_app'],
    invalidNameExamples: ['pr_nVe7ijuUMuwh9fb1j7CyBq', 'pr_2vKmcBluEENNfFKtXzrHBS'],
  },
})

export const environmentNameUsesIdFormatError: EnvironmentNameUsesIdFormatError = createApiError({
  code: 'validation.environment_name_uses_id_format',
  message:
    "The provided environment name is using an Id format. Please ensure the name is in a valid format: alphanumeric, with one hyphen as separator and underscores, and without the prefix 'en_'. Names must adhere to the length constraints of 2 to 255 characters and cannot resemble Ids.",
  details: {
    validNameExamples: ['staging', 'dev_copy', 'api-prod'],
    invalidNameExamples: ['ev_pTFmJBTuEENNfFKtXzrMQG', 'ev_9Ve7ijuUMuwh9fb1j7CyBq'],
  },
})

export const invalidNewEnvironmentNameError: InvalidNewEnvironmentNameError = createApiError({
  code: 'validation.invalid_new_environment_name',
  details: undefined,
  message:
    'Environment name must be alphanumeric, only underscores and hyphen separator allowed, min 2 and max 255 characters.',
})

export const newEnvironmentNameEqualsOriginal: NewEnvironmentNameEqualsOriginal = createApiError({
  code: 'validation.new_environment_name_equals_original',
  message: 'The new environment name cannot be the same as the original environment name.',
  details: undefined,
})

export const invalidNewProjectNameError: InvalidNewProjectNameError = createApiError({
  code: 'validation.invalid_new_project_name',
  message:
    'Project name must be alphanumeric only underscores or hyphens are allowed, min 2 and max 255 characters.',
  details: {
    example: {
      validProjectNames: ['my-project', 'booking-app-1', 'super_app'],
    },
  },
})
