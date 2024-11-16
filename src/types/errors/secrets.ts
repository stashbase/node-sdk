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
  | InvalidSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | SelfReferencingSecretsValidationError
  | SecretDescriptionsTooLongValidationError

export type DeleteSecretsError = GenericApiError | InvalidSecretNamesValidationError
export type GetSecretError = GenericApiError | ResourceApiError<'secret_not_found', undefined>
export type ListSecretsError = GenericApiError

export type SetSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError
  | InvalidSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | SelfReferencingSecretsValidationError
  | SecretDescriptionsTooLongValidationError

export type UpdateSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError
  | InvalidSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | DuplicateNewSecretNamesValidationError
  | SelfReferencingSecretsValidationError
  | InvalidNewSecretNamesValidationError
  | MissingPropertiesToUpdateValidationError
  | SecretDescriptionsTooLongValidationError
  | SelfReferencingSecretsConflictError
  | SecretsAlreadyExistConflictError

export type NoDataProvidedValidationError = ValidationApiError<'no_data_provided', undefined>
export type InvalidSecretNameValidationError = ValidationApiError<'invalid_secret_name', undefined>
export type InvalidSecretNamesValidationError =
  SecretsValidationErrorWithDetails<'invalid_secret_names'>

export type DuplicateSecretsNamesValidationError = ValidationApiError<
  'duplicate_secret_names',
  SecretsErrorDetails
>

export type SecretDescriptionsTooLongValidationError = ValidationApiError<
  'secret_descriptions_too_long',
  SecretsErrorDetails
>

export type SelfReferencingSecretsValidationError =
  SecretsValidationErrorWithDetails<'self_referencing_secrets'>

export type SelfReferencingSecretsConflictError = ConflictApiError<
  'self_referencing_secrets',
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
