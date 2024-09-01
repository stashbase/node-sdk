import { createApiError } from '.'
import { InvalidChangelogChangeIdError, InvalidChangelogPageError } from '../types/errors/changelog'
import { InvalidWebhookLogsLimitError } from '../types/errors/webhooks'

export const invalidChangelogChangeIdError: InvalidChangelogChangeIdError = createApiError({
  code: 'validation.invalid_change_id',
  message:
    "Provided change id is not valid. Change ids have prefix 'ch_' and must be 25 characters long.",
  details: {
    exampleChangeId: 'ch_m1DAScGeaJfFLSFUzTjiq8',
  },
})

export const invalidChangelogLimitError: InvalidWebhookLogsLimitError = createApiError({
  code: 'validation.invalid_limit',
  message: 'Limit must be a number between 2 and 10, defaulting to 5.',
  details: {
    min: 2,
    max: 10,
    default: 5,
  },
})

export const invalidChangelogPageError: InvalidChangelogPageError = createApiError({
  code: 'validation.invalid_page',
  message: 'Page number must a number between 1 and 1000.',
  details: {
    min: 1,
    max: 1000,
    default: 1,
  },
})
