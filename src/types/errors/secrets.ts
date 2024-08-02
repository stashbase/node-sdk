import { ApiError } from '../../http/response'
import { GenericApiError } from '.'

export type SecretsErrorDetails = {
  secretKeys: Array<string>
}

export type CreateSecretsError =
  | GenericApiError
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | SelfReferencingSecretsError

export type DeleteSecretsError = GenericApiError | InvalidSecretKeysError

export type GetSecretError = GenericApiError | ApiError<'secret_not_found'>

export type ListSecretsError = GenericApiError

export type SetSecretsError =
  | GenericApiError
  | NoDataProvided
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | SelfReferencingSecretsError

export type UpdateSecretsError =
  | GenericApiError
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
