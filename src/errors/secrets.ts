import { ApiError } from '../http/response'
import {
  DuplicateNewSecretsError,
  DuplicateSecretsError,
  InvalidNewSecretKeysError,
  InvalidSecretKeyError,
  InvalidSecretKeysError,
  MissingPropertiesToUpdateError,
  NoValuesProvidedError,
  SecretsErrorDetails,
  SelfReferencingSecretsError,
} from '../types/errors/secrets'

export const createSecretsError = <T extends string, D = undefined | SecretsErrorDetails>(args: {
  code: T
  message: string
  details: D
}) => {
  const error: ApiError<T, D> = {
    code: args.code,
    message: args.message,
    details: args.details,
  }

  return error
}

export const secretKeyFormatErrorMessage =
  'Secret keys cannot start with a digit, only uppercase alphanumeric characters and underscores allowed, min 2 and max 255 characters.'

export const invalidSecretKeysError = (secretKeys: Array<string>): InvalidSecretKeysError =>
  createSecretsError({
    code: 'invalid_secret_keys',
    message: secretKeyFormatErrorMessage,
    details: {
      secretKeys,
    },
  })

export const invalidSecretKeyError = (): InvalidSecretKeyError =>
  createSecretsError({
    code: 'invalid_secret_key',
    message: secretKeyFormatErrorMessage,
    details: undefined,
  })

export const duplicateSecretsError = (secretKeys: Array<string>): DuplicateSecretsError =>
  createSecretsError({
    code: 'duplicate_secrets',
    message: 'Duplicate secrets provided in the request.',
    details: {
      secretKeys,
    },
  })

export const selfReferencingSecretsError = (
  secretKeys: Array<string>
): SelfReferencingSecretsError =>
  createSecretsError({
    code: 'self_referencing_secrets',
    message: 'Self referencing secrets are not allowed.',
    details: {
      secretKeys,
    },
  })

export const missingPropertiesToUpdateError = (
  secretKeys: Array<string>
): MissingPropertiesToUpdateError =>
  createSecretsError({
    code: 'missing_properties_to_update',
    message: 'At least one property to update must be provided.',
    details: {
      secretKeys,
    },
  })

export const invalidNewSecretKeysError = (secretKeys: Array<string>): InvalidNewSecretKeysError =>
  createSecretsError({
    code: 'invalid_new_secret_keys',
    message: secretKeyFormatErrorMessage,
    details: {
      secretKeys,
    },
  })

export const duplicateNewSecretsError = (secretKeys: Array<string>): DuplicateNewSecretsError =>
  createSecretsError({
    code: 'duplicate_new_secrets',
    message: secretKeyFormatErrorMessage,
    details: {
      secretKeys,
    },
  })

export const noValuesProvidedError = (): NoValuesProvidedError =>
  createSecretsError({
    details: undefined,
    code: 'no_values_provided',
    message: 'At least one data item must be provided.',
  })
