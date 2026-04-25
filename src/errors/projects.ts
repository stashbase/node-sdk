import { createApiError } from '.'
import { ApiError } from '../http/response'
import { ProjectDescriptionTooLongErrorCode } from '../types/errors/projects'

export const projectDescriptionTooLongError: ApiError<ProjectDescriptionTooLongErrorCode> =
  createApiError({
    code: 'validation.project_description_too_long',
    message: 'The project description cannot be longer than 255 characters.',
    details: {
      maxLength: 255,
    },
  })
