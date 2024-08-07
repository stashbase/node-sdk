import { ConflictApiError, GenericApiError, ResourceApiError, ValidationApiError } from './'

export type SecretsErrorDetails = {
  secretKeys: Array<string>
}

type SecretsValidationErrorWithDetails<T extends string> = ValidationApiError<
  T,
  SecretsErrorDetails
>

export type CreateSecretsError =
  | GenericApiError
  | InvalidSecretKeysValidationError
  | DuplicateSecretsKeysValidationError
  | SelfReferencingSecretsValidationError

export type DeleteSecretsError = GenericApiError | InvalidSecretKeysValidationError
export type GetSecretError = GenericApiError | ResourceApiError<'secret_not_found', undefined>
export type ListSecretsError = GenericApiError

export type SetSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError
  | InvalidSecretKeysValidationError
  | DuplicateSecretsKeysValidationError
  | SelfReferencingSecretsValidationError

export type UpdateSecretsError =
  | GenericApiError
  | NoDataProvidedValidationError
  | InvalidSecretKeysValidationError
  | DuplicateSecretsKeysValidationError
  | DuplicateNewSecretKeysValidationError
  | SelfReferencingSecretsValidationError
  | InvalidNewSecretKeysValidationError
  | MissingPropertiesToUpdateValidationError
  | SelfReferencingSecretsConflictError
  | SecretsAlreadyExistConflictError

export type NoDataProvidedValidationError = ValidationApiError<'no_data_provided'>
export type InvalidSecretKeyValidationError = ValidationApiError<'invalid_secret_key', undefined>
export type InvalidSecretKeysValidationError =
  SecretsValidationErrorWithDetails<'invalid_secret_keys'>

export type DuplicateSecretsKeysValidationError = ValidationApiError<
  'duplicate_secret_keys',
  SecretsErrorDetails
>

export type SelfReferencingSecretsValidationError =
  SecretsValidationErrorWithDetails<'self_referencing_secrets'>

export type SelfReferencingSecretsConflictError = ConflictApiError<
  'self_referencing_secrets',
  SecretsErrorDetails
>

export type DuplicateNewSecretKeysValidationError =
  SecretsValidationErrorWithDetails<'duplicate_new_secret_keys'>

export type InvalidNewSecretKeysValidationError =
  SecretsValidationErrorWithDetails<'invalid_new_secret_keys'>

export type NewSecretKeysSameAsKeysValidationError =
  SecretsValidationErrorWithDetails<'new_secret_keys_same_as_keys'>

export type MissingPropertiesToUpdateValidationError =
  SecretsValidationErrorWithDetails<'missing_properties_to_update'>

export type SecretsAlreadyExistConflictError =
  SecretsValidationErrorWithDetails<'secrets_already_exist'>
