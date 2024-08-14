import { ApiError } from '../http/response'
import {
  DuplicateNewSecretKeysValidationError,
  DuplicateSecretsKeysValidationError,
  InvalidNewSecretKeysValidationError,
  InvalidSecretKeyValidationError,
  InvalidSecretKeysValidationError,
  MissingPropertiesToUpdateValidationError,
  NewSecretKeysSameAsKeysValidationError,
  NoDataProvidedValidationError,
  SecretsErrorDetails,
  SelfReferencingSecretsValidationError,
} from '../types/errors/secrets'

export const createSecretsError = <T extends string, D = undefined | SecretsErrorDetails>(args: {
  code: T
  message: string
  details: D
}) => {
  return new ApiError(args.code, args.details, args.message)
}

export const secretKeyFormatErrorMessage =
  'Secret keys cannot start with a digit, only uppercase alphanumeric characters and underscores allowed, min 2 and max 255 characters.'

export const invalidSecretKeysError = (
  secretKeys: Array<string>
): InvalidSecretKeysValidationError =>
  createSecretsError({
    code: 'validation.invalid_secret_keys',
    message: secretKeyFormatErrorMessage,
    details: {
      secretKeys,
    },
  })

export const invalidSecretKeyError = (): InvalidSecretKeyValidationError =>
  createSecretsError({
    code: 'validation.invalid_secret_key',
    message: secretKeyFormatErrorMessage,
    details: undefined,
  })

export const duplicateSecretKeysError = (
  secretKeys: Array<string>
): DuplicateSecretsKeysValidationError =>
  createSecretsError({
    code: 'validation.duplicate_secret_keys',
    message: `One or more secrets with the same value of property 'key' provided in the request.`,
    details: {
      secretKeys,
    },
  })

export const duplicateNewSecretKeysError = (
  secretKeys: Array<string>
): DuplicateNewSecretKeysValidationError =>
  createSecretsError({
    code: 'validation.duplicate_new_secret_keys',
    message: `One or more secrets with the same value of property 'newKey' provided in the request.`,
    details: {
      secretKeys,
    },
  })

export const selfReferencingSecretsError = (
  secretKeys: Array<string>
): SelfReferencingSecretsValidationError =>
  createSecretsError({
    code: 'validation.self_referencing_secrets',
    message: 'One or more secrets would result in self-reference, which is not allowed.',
    details: {
      secretKeys,
    },
  })

export const missingPropertiesToUpdateError = (
  secretKeys: Array<string>
): MissingPropertiesToUpdateValidationError =>
  createSecretsError({
    code: 'validation.missing_properties_to_update',
    message: 'At least one property to update must be provided.',
    details: {
      secretKeys,
    },
  })

export const invalidNewSecretKeysError = (
  secretKeys: Array<string>
): InvalidNewSecretKeysValidationError =>
  createSecretsError({
    code: 'validation.invalid_new_secret_keys',
    message: secretKeyFormatErrorMessage,
    details: {
      secretKeys,
    },
  })

export const newKeysSameAsKeys = (
  secretKeys: Array<string>
): NewSecretKeysSameAsKeysValidationError =>
  createSecretsError({
    code: 'validation.new_secret_keys_same_as_keys',
    message:
      "One or more values of property 'newKey' match the provided 'key' values in the request.",
    details: {
      secretKeys,
    },
  })

export const noDataProvidedError = (): NoDataProvidedValidationError =>
  createSecretsError({
    details: undefined,
    code: 'validation.no_data_provided',
    message: 'At least one data item must be provided.',
  })
