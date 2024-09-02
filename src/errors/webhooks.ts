import { createApiError } from '.'
import {
  InvalidWebhookDescriptionValidationError,
  InvalidWebhookIdError,
  InvalidWebhookLogsLimitError,
  InvalidWebhookLogsPageError,
  InvalidWebhookUrlValidationError,
  WebhookMissingPropertiesToUpdateValidationError,
} from '../types/errors/webhooks'

export const invalidWebhookIdError: InvalidWebhookIdError = createApiError({
  code: 'validation.invalid_webhook_id',
  message:
    "Provided webhook Id is is not valid. Webhook Ids have prefix 'whk_' followed by 22 alphanumeric characters.",
  details: {
    exampleWebhookId: 'whk_m1DAScGeaJfFLSFUzTjiq8',
  },
})

export const invalidWebhookUrlError: InvalidWebhookUrlValidationError = createApiError({
  code: 'validation.invalid_webhook_url',
  message: `The webhook URL must be valid and use HTTPS for secure communication. Please provide a URL that starts with 'https://'.`,
  details: {
    validUrlExample: 'https://my-endpoint.com',
  },
})

export const invalidWebhookDescriptionError: InvalidWebhookDescriptionValidationError =
  createApiError({
    code: 'validation.invalid_webhook_description',
    message: 'The description must be a string no longer than 200 characters.',
    details: {
      maxLength: 200,
    },
  })

export const webhookMissingPropertiesToUpdateError: WebhookMissingPropertiesToUpdateValidationError =
  createApiError({
    code: 'validation.missing_properties_to_update',
    message: 'At least one property to update must be provided.',
    details: {
      possibleProperties: ['url', 'description'],
    },
  })

export const invalidWebhookLogsPageError: InvalidWebhookLogsPageError = createApiError({
  code: 'validation.invalid_page',
  message: 'Page number must a number between 1 and 1000.',
  details: {
    min: 1,
    max: 1000,
    default: 1,
  },
})

export const invalidWebhookLogsLimitError: InvalidWebhookLogsLimitError = createApiError({
  code: 'validation.invalid_limit',
  message: 'Limit must be a number between 2 and 30, defaulting to 10.',
  details: {
    min: 2,
    max: 30,
    default: 10,
  },
})
