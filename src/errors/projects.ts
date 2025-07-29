import { createApiError } from '.'
import { ProjectDescriptionTooLongError } from '../types/errors/projects'

export const projectDescriptionTooLongError: ProjectDescriptionTooLongError = createApiError({
  code: 'validation.project_description_too_long',
  message: 'The project description cannot be longer than 255 characters.',
  details: {
    maxLength: 255,
  },
})
