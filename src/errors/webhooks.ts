import { createApiError } from '.'
import {
  InvalidWebhookIdError,
  WebhookMissingPropertiesToUpdateValidationError,
  WebhookUrlHttpsRequiredValidationError,
} from '../types/errors/webhooks'

export const invalidWebhookIdError: InvalidWebhookIdError = createApiError({
  code: 'validation.invalid_webhook_id',
  message:
    "Provided webhook Id is is not valid. Webhook Ids have prefix 'wh_' and must be 25 characters long.",
  details: {
    exampleWebhookId: 'wh_m1DAScGeaJfFLSFUzTjiq8',
  },
})

export const webhookUrlHttpsRequiredError: WebhookUrlHttpsRequiredValidationError = createApiError({
  code: 'validation.webhook_url_https_required',
  message: `The webhook URL must use HTTPS for secure communication. Please provide a URL that starts with 'https://'.`,
  details: {
    validUrlExample: 'https://my-endpoint.com',
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
