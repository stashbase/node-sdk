import { GenericApiError, ResourceApiError } from '.'

export type ListWebhooksError = GenericApiError
export type CreateWebhookError = GenericApiError

export type UpdateWebhookError = GenericApiError | WebhookNotFoundError
export type DeleteWebhookError = GenericApiError | WebhookNotFoundError
export type GetWebhookError = GenericApiError | WebhookNotFoundError
export type RotateWebhookSigningSecretError = GenericApiError | WebhookNotFoundError
export type GetWebhookSigningSecretError = GenericApiError | WebhookNotFoundError
export type TestWebhookError = GenericApiError | WebhookNotFoundError
export type ListWebhookLogsError = GenericApiError | WebhookNotFoundError

type WebhookNotFoundError = ResourceApiError<'webhook_not_found', undefined>
