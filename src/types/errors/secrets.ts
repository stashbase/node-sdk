import { GenericApiError, ResourceApiError, ValidationApiError } from './'

export type SecretsErrorDetails = {
  secretNames: Array<string>
}

type SecretsValidationErrorWithDetails<T extends string> = ValidationApiError<
  T,
  SecretsErrorDetails
>

export type CreateSecretsError =
  | GenericApiError
  | NoDataProvidedError
  | InvalidSecretNamesError
  | DuplicateSecretsNamesError
  | SecretCommentsTooLongError
  | SecretValuesTooLongError

export type DeleteSecretsError = GenericApiError | InvalidSecretNamesError | NoDataProvidedError

export type GetSecretError = GenericApiError | SecretNotFoundError | InvalidSecretNameError

export type ListSecretsError = GenericApiError

export type ListOnlySecretsError = ListSecretsError | NoDataProvidedError | InvalidSecretNamesError

export type ListExcludeSecretsError =
  | ListSecretsError
  | NoDataProvidedError
  | InvalidSecretNamesError

export type SetSecretsError =
  | GenericApiError
  | NoDataProvidedError
  | InvalidSecretNamesError
  | DuplicateSecretsNamesError
  | SecretCommentsTooLongError
  | SecretValuesTooLongError

export type UpdateSecretsError =
  | GenericApiError
  | NoDataProvidedError
  | InvalidSecretNamesError
  | DuplicateSecretsNamesError
  | DuplicateNewSecretNamesError
  | InvalidNewSecretNamesError
  | MissingPropertiesToUpdateError
  | SecretCommentsTooLongError
  | SecretValuesTooLongError
  | SecretsAlreadyExistError
  | NewSecretNamesSameAsNamesError

export type SecretNotFoundError = ResourceApiError<'secret_not_found', undefined>
export type NoDataProvidedError = ValidationApiError<'no_data_provided', undefined>
export type InvalidSecretNameError = ValidationApiError<'invalid_secret_name', undefined>
export type InvalidSecretNamesError = SecretsValidationErrorWithDetails<'invalid_secret_names'>

export type DuplicateSecretsNamesError = ValidationApiError<
  'duplicate_secret_names',
  SecretsErrorDetails
>

export type SecretCommentsTooLongError = ValidationApiError<
  'secret_comments_too_long',
  SecretsErrorDetails
>

export type SecretValuesTooLongError = ValidationApiError<
  'secret_values_too_long',
  SecretsErrorDetails
>

export type DuplicateNewSecretNamesError =
  SecretsValidationErrorWithDetails<'duplicate_new_secret_names'>

export type InvalidNewSecretNamesError =
  SecretsValidationErrorWithDetails<'invalid_new_secret_names'>

export type NewSecretNamesSameAsNamesError =
  SecretsValidationErrorWithDetails<'new_secret_names_same_as_names'>

export type MissingPropertiesToUpdateError =
  SecretsValidationErrorWithDetails<'missing_properties_to_update'>

export type SecretsAlreadyExistError = SecretsValidationErrorWithDetails<'secrets_already_exist'>
