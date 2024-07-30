import { ApiError, SharedApiError } from '../../http/response'

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
  | NoValuesProvidedError
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | SelfReferencingSecretsError

export type UpdateSecretsError =
  | SharedApiError
  | NoValuesProvidedError
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | DuplicateNewSecretsError
  | SelfReferencingSecretsError
  | ApiError<'invalid_new_secret_keys', { newSecretKeys: Array<string> }>
  | ApiError<'missing_properties_to_update', { secretKeys: Array<string> }>
  | ApiError<'new_key_secrets_already_exist', { conflictingSecrets: Array<string> }>

type NoValuesProvidedError = ApiError<'no_values_provided'>
type InvalidSecretKeysError = ApiError<'invalid_secret_keys', { secretKeys: Array<string> }>
type DuplicateSecretsError = ApiError<'duplicate_secrets', { duplicateSecrets: Array<string> }>
type SelfReferencingSecretsError = ApiError<'self_referencing_secrets', { secrets: Array<string> }>
type DuplicateNewSecretsError = ApiError<
  'duplicate_new_secrets',
  { duplicateSecrets: Array<string> }
>
