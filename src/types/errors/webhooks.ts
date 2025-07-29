import {
  ConflictApiError,
  GenericApiError,
  QuotaLimitApiError,
  ResourceApiError,
  ValidationApiError,
} from '.'

export type ListWebhooksError = GenericApiError
export type CreateWebhookError = GenericApiError | WebhookLimitReachedError

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

export type InvalidWebhookUrlValidationError = ValidationApiError<
  'invalid_webhook_url',
  {
    validUrlExample: string
  }
>

export type WebhookDescriptionTooLongError = ValidationApiError<
  'webhook_description_too_long',
  {
    maxLength: number
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

export type InvalidWebhookLogsLimitError = ValidationApiError<
  'invalid_limit',
  {
    /** Min possbile value for the limit */
    min: number
    /** Max possible value for the limit */
    max: number
    /** Default value for the limit */
    default: number
  }
>

export type InvalidWebhookLogsPageError = ValidationApiError<
  'invalid_page',
  {
    /** Min possbile value for the limit */
    min: number
    /** Max possible value for the limit */
    max: number
    /** Default value for the limit */
    default: number
  }
>

type WebhookNotFoundError = ResourceApiError<'webhook_not_found', undefined>

type WebhookLimitReachedError = QuotaLimitApiError<'webhook_limit_reached', undefined>
