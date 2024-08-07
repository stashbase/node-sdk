import { ApiError } from '../../http/response'
import { GenericApiError } from '.'

export type SecretsErrorDetails = {
  secretKeys: Array<string>
}

export type CreateSecretsError =
  | GenericApiError
  | InvalidSecretKeysError
  | DuplicateSecretsKeysError
  | SelfReferencingSecretsError

export type DeleteSecretsError = GenericApiError | InvalidSecretKeysError

export type GetSecretError = GenericApiError | ApiError<'secret_not_found'>

export type ListSecretsError = GenericApiError

export type SetSecretsError =
  | GenericApiError
  | NoDataProvided
  | InvalidSecretKeysError
  | DuplicateSecretsKeysError
  | SelfReferencingSecretsError

export type UpdateSecretsError =
  | GenericApiError
  | NoDataProvided
  | InvalidSecretKeysError
  | DuplicateSecretsKeysError
  | DuplicateNewSecretKeysError
  | SelfReferencingSecretsError
  | InvalidNewSecretKeysError
  | MissingPropertiesToUpdateError
  | SecretsAlreadyExistError

export type NoDataProvided = ApiError<'no_data_provided'>
export type InvalidSecretKeysError = ApiError<'invalid_secret_keys', SecretsErrorDetails>
export type InvalidSecretKeyError = ApiError<'invalid_secret_key', undefined>
export type DuplicateSecretsKeysError = ApiError<'duplicate_secret_keys', SecretsErrorDetails>
export type SelfReferencingSecretsError = ApiError<'self_referencing_secrets', SecretsErrorDetails>
export type DuplicateNewSecretKeysError = ApiError<'duplicate_new_secret_keys', SecretsErrorDetails>
export type InvalidNewSecretKeysError = ApiError<'invalid_new_secret_keys', SecretsErrorDetails>
export type MissingPropertiesToUpdateError = ApiError<
  'missing_properties_to_update',
  SecretsErrorDetails
>
export type SecretsAlreadyExistError = ApiError<'secrets_already_exist', SecretsErrorDetails>
