import { createApiError } from '.'
import { EnvironmentDescriptionTooLongError } from '../types/errors/environments'

export const environmentDescriptionTooLongError: EnvironmentDescriptionTooLongError =
  createApiError({
    code: 'validation.environment_description_too_long',
    message: 'The environment description cannot be longer than 255 characters.',
    details: {
      maxLength: 255,
    },
  })
