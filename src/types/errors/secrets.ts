import { ApiError, SharedApiError } from '../../http/response'

export type SecretsErrorDetails = {
  secretKeys: Array<string>
}

export type CreateSecretsError =
  | SharedApiError
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | SelfReferencingSecretsError

export type DeleteSecretsError = SharedApiError | InvalidSecretKeysError

export type GetSecretError = SharedApiError | ApiError<'secret_not_found'>

export type ListSecretsError = SharedApiError

export type SetSecretsError =
  | SharedApiError
  | NoDataProvided
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | SelfReferencingSecretsError

export type UpdateSecretsError =
  | SharedApiError
  | NoDataProvided
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | DuplicateNewSecretsError
  | SelfReferencingSecretsError
  | InvalidNewSecretKeysError
  | MissingPropertiesToUpdateError
  | NewKeySecretsAlreadyExistError

export type NoDataProvided = ApiError<'no_data_provided'>
export type InvalidSecretKeysError = ApiError<'invalid_secret_keys', SecretsErrorDetails>
export type InvalidSecretKeyError = ApiError<'invalid_secret_key', undefined>
export type DuplicateSecretsError = ApiError<'duplicate_secrets', SecretsErrorDetails>
export type SelfReferencingSecretsError = ApiError<'self_referencing_secrets', SecretsErrorDetails>
export type DuplicateNewSecretsError = ApiError<'duplicate_new_secrets', SecretsErrorDetails>
export type InvalidNewSecretKeysError = ApiError<'invalid_new_secret_keys', SecretsErrorDetails>
export type MissingPropertiesToUpdateError = ApiError<
  'missing_properties_to_update',
  SecretsErrorDetails
>
export type NewKeySecretsAlreadyExistError = ApiError<
  'new_key_secrets_already_exist',
  SecretsErrorDetails
>
