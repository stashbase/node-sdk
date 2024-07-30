import { SecretKey } from '../secretKey'
import { ApiError, EnvironmentNotFoundError, ProjectNotFoundError } from '../../http/response'

type SharedSecretsError = ProjectNotFoundError | EnvironmentNotFoundError

export type CreateSecretsError =
  | SharedSecretsError
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | SelfReferencingSecretsError

export type DeleteSecretsError = SharedSecretsError | InvalidSecretKeysError

export type GetSecretError = ApiError<'secret_not_found'>

export type ListSecretsError = SharedSecretsError

export type SetSecretsError =
  | NoValuesProvidedError
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | SelfReferencingSecretsError

export type UpdateSecretsError =
  | SharedSecretsError
  | NoValuesProvidedError
  | InvalidSecretKeysError
  | DuplicateSecretsError
  | DuplicateNewSecretsError
  | SelfReferencingSecretsError
  | ApiError<'invalid_new_secret_keys', { newSecretKeys: Array<string> }>
  | ApiError<'missing_properties_to_update', { secretKeys: Array<SecretKey> }>
  | ApiError<'new_key_secrets_already_exist', { conflictingSecrets: Array<SecretKey> }>

type NoValuesProvidedError = ApiError<'no_values_provided'>
type InvalidSecretKeysError = ApiError<'invalid_secret_keys', { secretKeys: Array<string> }>
type DuplicateSecretsError = ApiError<'duplicate_secrets', { duplicateSecrets: Array<SecretKey> }>
type SelfReferencingSecretsError = ApiError<
  'self_referencing_secrets',
  { secrets: Array<SecretKey> }
>
type DuplicateNewSecretsError = ApiError<
  'duplicate_new_secrets',
  { duplicateSecrets: Array<SecretKey> }
>
