import { GlobalErrorCode } from './index'

export type InvalidWebhookIdErrorCode = 'validation.invalid_webhook_id'
export type InvalidWebhookLogIdErrorCode = 'validation.invalid_webhook_log_id'
export type InvalidWebhookUrlErrorCode = 'validation.invalid_webhook_url'
export type WebhookDescriptionTooLongErrorCode = 'validation.webhook_description_too_long'
export type WebhookMissingPropertiesToUpdateErrorCode = 'validation.missing_properties_to_update'
export type WebhookAlreadyEnabledConflictErrorCode = 'conflict.webhook_already_enabled'
export type WebhookAlreadyDisabledConflictErrorCode = 'conflict.webhook_already_disabled'
export type InvalidWebhookLogsPageSizeErrorCode = 'validation.invalid_page_size'
export type InvalidWebhookLogsPageErrorCode = 'validation.invalid_page'
export type WebhookNotFoundErrorCode = 'resource.webhook_not_found'
export type WebhookLimitReachedErrorCode = 'quota.webhook_limit_reached'

export type SingleWebhookErrorCode =
  | GlobalErrorCode
  | InvalidWebhookIdErrorCode
  | WebhookNotFoundErrorCode

export type SingleWebhookLogErrorCode = SingleWebhookErrorCode | InvalidWebhookLogIdErrorCode

export type ListWebhooksErrorCode = GlobalErrorCode

export type CreateWebhookErrorCode =
  | GlobalErrorCode
  | InvalidWebhookUrlErrorCode
  | WebhookDescriptionTooLongErrorCode
  | WebhookLimitReachedErrorCode

export type UpdateWebhookErrorCode =
  | SingleWebhookErrorCode
  | InvalidWebhookUrlErrorCode
  | WebhookDescriptionTooLongErrorCode
  | WebhookMissingPropertiesToUpdateErrorCode

export type UpdateWebhookStatusErrorCode =
  | SingleWebhookErrorCode
  | WebhookAlreadyEnabledConflictErrorCode
  | WebhookAlreadyDisabledConflictErrorCode

export type DeleteWebhookErrorCode = SingleWebhookErrorCode
export type GetWebhookErrorCode = SingleWebhookErrorCode
export type GetWebhookLogErrorCode = SingleWebhookLogErrorCode
export type RotateWebhookSigningSecretErrorCode = SingleWebhookErrorCode
export type GetWebhookSigningSecretErrorCode = SingleWebhookErrorCode
export type TestWebhookErrorCode = SingleWebhookErrorCode

export type ListWebhookLogsErrorCode =
  | SingleWebhookErrorCode
  | InvalidWebhookLogsPageSizeErrorCode
  | InvalidWebhookLogsPageErrorCode
