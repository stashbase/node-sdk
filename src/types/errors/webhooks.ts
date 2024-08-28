import { ConflictApiError, GenericApiError, ResourceApiError, ValidationApiError } from '.'

export type ListWebhooksError = GenericApiError
export type CreateWebhookError = GenericApiError

export type UpdateWebhookError =
  | SingleWebhookError
  | WebhookMissingPropertiesToUpdateValidationError

export type UpdateWebhookStatusError =
  | SingleWebhookError
  | WebhookAlreadyEnabledConflictError
  | WebhookAlreadyDisabledConflictError

export type DeleteWebhookError = SingleWebhookError
export type GetWebhookError = SingleWebhookError

export type RotateWebhookSigningSecretError = SingleWebhookError
export type GetWebhookSigningSecretError = SingleWebhookError
export type TestWebhookError = SingleWebhookError
export type ListWebhookLogsError = SingleWebhookError

//
export type SingleWebhookError = GenericApiError | InvalidWebhookIdError | WebhookNotFoundError

export type InvalidWebhookIdError = ValidationApiError<
  'invalid_webhook_id',
  {
    exampleWebhookId: string
  }
>

export type WebhookUrlHttpsRequiredValidationError = ValidationApiError<
  'webhook_url_https_required',
  {
    validUrlExample: string
  }
>

export type WebhookMissingPropertiesToUpdateValidationError = ValidationApiError<
  'missing_properties_to_update',
  {
    possibleProperties: Array<'url' | 'description'>
  }
>

export type WebhookAlreadyEnabledConflictError = ConflictApiError<
  'webhook_already_enabled',
  undefined
>

export type WebhookAlreadyDisabledConflictError = ConflictApiError<
  'webhook_already_disabled',
  undefined
>

type WebhookNotFoundError = ResourceApiError<'webhook_not_found', undefined>
