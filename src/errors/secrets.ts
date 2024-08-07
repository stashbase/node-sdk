import { ApiError } from '../http/response'
import {
  DuplicateNewSecretKeysError,
  DuplicateSecretsKeysError,
  InvalidNewSecretKeysError,
  InvalidSecretKeyError,
  InvalidSecretKeysError,
  MissingPropertiesToUpdateError,
  NoDataProvided,
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

export const duplicateSecretKeysError = (secretKeys: Array<string>): DuplicateSecretsKeysError =>
  createSecretsError({
    code: 'duplicate_secret_keys',
    message: `One or more secrets with the same value of property 'key' provided in the request.`,
    details: {
      secretKeys,
    },
  })

export const duplicateNewSecretKeysError = (
  secretKeys: Array<string>
): DuplicateNewSecretKeysError =>
  createSecretsError({
    code: 'duplicate_new_secret_keys',
    message: `One or more secrets with the same value of property 'newKey' provided in the request.`,
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

export const noDataProvidedError = (): NoDataProvided =>
  createSecretsError({
    details: undefined,
    code: 'no_data_provided',
    message: 'At least one data item must be provided.',
  })
