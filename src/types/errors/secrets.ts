import { ConflictApiError, GenericApiError, ResourceApiError, ValidationApiError } from './'

export type SecretsErrorDetails = {
  secretNames: Array<string>
}

type SecretsValidationErrorWithDetails<T extends string> = ValidationApiError<
  T,
  SecretsErrorDetails
>

export type CreateSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError
  | InvalidSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | SecretCommentsTooLongValidationError
  | SecretValuesTooLongValidationError

export type DeleteSecretsError =
  | GenericApiError
  | InvalidSecretNamesValidationError
  | NoDataProvidedValidationError

export type GetSecretError =
  | GenericApiError
  | SecretNotFoundError
  | InvalidSecretNameValidationError

export type ListSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError // for listOnly and listExclude
  | InvalidSecretNamesValidationError // for listOnly and listExclude

export type SetSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError
  | InvalidSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | SecretCommentsTooLongValidationError
  | SecretValuesTooLongValidationError

export type UpdateSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError
  | InvalidSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | DuplicateNewSecretNamesValidationError
  | InvalidNewSecretNamesValidationError
  | MissingPropertiesToUpdateValidationError
  | SecretCommentsTooLongValidationError
  | SecretValuesTooLongValidationError
  | SecretsAlreadyExistConflictError
  | NewSecretNamesSameAsNamesValidationError

export type SecretNotFoundError = ResourceApiError<'secret_not_found', undefined>
export type NoDataProvidedValidationError = ValidationApiError<'no_data_provided', undefined>
export type InvalidSecretNameValidationError = ValidationApiError<'invalid_secret_name', undefined>
export type InvalidSecretNamesValidationError =
  SecretsValidationErrorWithDetails<'invalid_secret_names'>

export type DuplicateSecretsNamesValidationError = ValidationApiError<
  'duplicate_secret_names',
  SecretsErrorDetails
>

export type SecretCommentsTooLongValidationError = ValidationApiError<
  'secret_comments_too_long',
  SecretsErrorDetails
>

export type SecretValuesTooLongValidationError = ValidationApiError<
  'secret_values_too_long',
  SecretsErrorDetails
>

export type DuplicateNewSecretNamesValidationError =
  SecretsValidationErrorWithDetails<'duplicate_new_secret_names'>

export type InvalidNewSecretNamesValidationError =
  SecretsValidationErrorWithDetails<'invalid_new_secret_names'>

export type NewSecretNamesSameAsNamesValidationError =
  SecretsValidationErrorWithDetails<'new_secret_names_same_as_names'>

export type MissingPropertiesToUpdateValidationError =
  SecretsValidationErrorWithDetails<'missing_properties_to_update'>

export type SecretsAlreadyExistConflictError =
  SecretsValidationErrorWithDetails<'secrets_already_exist'>
