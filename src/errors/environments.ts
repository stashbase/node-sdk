import { createApiError } from '.'
import { ApiError } from '../http/response'
import { EnvironmentDescriptionTooLongErrorCode } from '../types/errors/environments'

export const environmentDescriptionTooLongError: ApiError<EnvironmentDescriptionTooLongErrorCode> =
  createApiError({
    code: 'validation.environment_description_too_long',
    message: 'The environment description cannot be longer than 255 characters.',
    details: {
      maxLength: 255,
    },
  })
