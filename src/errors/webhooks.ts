import { createApiError } from '.'
import { ApiError } from '../http/response'
import {
  InvalidWebhookIdErrorCode,
  InvalidWebhookLogsPageErrorCode,
  InvalidWebhookLogsPageSizeErrorCode,
  InvalidWebhookUrlErrorCode,
  WebhookDescriptionTooLongErrorCode,
  WebhookMissingPropertiesToUpdateErrorCode,
} from '../types/errors/webhooks'

export const invalidWebhookIdError: ApiError<InvalidWebhookIdErrorCode> = createApiError({
  code: 'validation.invalid_webhook_id',
  message:
    "Provided webhook Id is is not valid. Webhook Ids have prefix 'whk_' followed by 22 alphanumeric characters.",
  details: {
    exampleWebhookId: 'whk_m1DAScGeaJfFLSFUzTjiq8',
  },
})

export const invalidWebhookUrlError: ApiError<InvalidWebhookUrlErrorCode> = createApiError({
  code: 'validation.invalid_webhook_url',
  message:
    'The webhook URL is invalid. Webhook URLs cannot be longer than 512 characters, must use HTTPS, and cannot use localhost, loopback addresses, or private IP ranges.',
  details: {
    validUrlExample: 'https://my-endpoint.com',
  },
})

export const webhookDescriptionTooLongError: ApiError<WebhookDescriptionTooLongErrorCode> =
  createApiError({
    code: 'validation.webhook_description_too_long',
    message: 'The webhook description cannot be longer than 255 characters.',
    details: {
      maxLength: 255,
    },
  })

export const webhookMissingPropertiesToUpdateError: ApiError<WebhookMissingPropertiesToUpdateErrorCode> =
  createApiError({
    code: 'validation.missing_properties_to_update',
    message: 'At least one property to update must be provided.',
    details: {
      possibleProperties: ['url', 'description'],
    },
  })

export const invalidWebhookLogsPageError: ApiError<InvalidWebhookLogsPageErrorCode> = createApiError({
  code: 'validation.invalid_page',
  message: 'Page number must a number between 1 and 1000.',
  details: {
    min: 1,
    max: 1000,
    default: 1,
  },
})

export const invalidWebhookLogsPageSizeError: ApiError<InvalidWebhookLogsPageSizeErrorCode> =
  createApiError({
    code: 'validation.invalid_page_size',
    message: 'Page size must be a number between 2 and 30, defaulting to 10.',
    details: {
      min: 2,
      max: 30,
      default: 10,
    },
  })
