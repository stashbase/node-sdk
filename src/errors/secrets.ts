import { ApiError } from '../http/response'
import {
  DuplicateNewSecretNamesValidationError,
  DuplicateSecretsNamesValidationError,
  InvalidNewSecretNamesValidationError,
  InvalidSecretNameValidationError,
  InvalidSecretNamesValidationError,
  MissingPropertiesToUpdateValidationError,
  NewSecretNamesSameAsNamesValidationError,
  NoDataProvidedValidationError,
  SecretDescriptionsTooLongValidationError,
  SecretValuesTooLongValidationError,
  SecretsErrorDetails,
  SelfReferencingSecretsValidationError,
} from '../types/errors/secrets'
import { SECRET_DESCRIPTION_MAX_LENGTH, SECRET_VALUE_MAX_LENGTH } from '../utils/inputValidation'

export const createSecretsError = <T extends string, D = undefined | SecretsErrorDetails>(args: {
  code: T
  message: string
  details: D
}) => {
  return new ApiError(args.code, args.details, args.message)
}

export const secretNameFormatErrorMessage =
  'Secret names cannot start with a digit, only uppercase alphanumeric characters and underscores allowed, min 2 and max 255 characters.'

export const invalidSecretNamesError = (
  secretNames: Array<string>
): InvalidSecretNamesValidationError =>
  createSecretsError({
    code: 'validation.invalid_secret_names',
    message: secretNameFormatErrorMessage,
    details: {
      secretNames,
    },
  })

export const invalidSecretNameError = (): InvalidSecretNameValidationError =>
  createSecretsError({
    code: 'validation.invalid_secret_name',
    message: secretNameFormatErrorMessage,
    details: undefined,
  })

export const duplicateSecretNamesError = (
  secretNames: Array<string>
): DuplicateSecretsNamesValidationError =>
  createSecretsError({
    code: 'validation.duplicate_secret_names',
    message: `One or more secrets with the same value of property 'name' provided in the request.`,
    details: {
      secretNames,
    },
  })

export const duplicateNewSecretNamesError = (
  secretNames: Array<string>
): DuplicateNewSecretNamesValidationError =>
  createSecretsError({
    code: 'validation.duplicate_new_secret_names',
    message: `One or more secrets with the same value of property 'newName' provided in the request.`,
    details: {
      secretNames,
    },
  })

export const selfReferencingSecretsError = (
  secretNames: Array<string>
): SelfReferencingSecretsValidationError =>
  createSecretsError({
    code: 'validation.self_referencing_secrets',
    message: 'One or more secrets would result in self-reference, which is not allowed.',
    details: {
      secretNames,
    },
  })

export const missingPropertiesToUpdateError = (
  secretNames: Array<string>
): MissingPropertiesToUpdateValidationError =>
  createSecretsError({
    code: 'validation.missing_properties_to_update',
    message: 'At least one property to update must be provided.',
    details: {
      secretNames,
    },
  })

export const invalidNewSecretNamesError = (
  secretNames: Array<string>
): InvalidNewSecretNamesValidationError =>
  createSecretsError({
    code: 'validation.invalid_new_secret_names',
    message: secretNameFormatErrorMessage,
    details: {
      secretNames,
    },
  })

export const newSecretNamesSameAsNamesError = (
  secretNames: Array<string>
): NewSecretNamesSameAsNamesValidationError =>
  createSecretsError({
    code: 'validation.new_secret_names_same_as_names',
    message:
      "One or more values of property 'newName' match the provided 'name' values in the request.",
    details: {
      secretNames,
    },
  })

export const secretDescriptionsTooLongError = (
  secretNames: Array<string>
): SecretDescriptionsTooLongValidationError =>
  createSecretsError({
    code: 'validation.secret_descriptions_too_long',
    message: `One or more secret descriptions are too long. Description cannot be longer than ${SECRET_DESCRIPTION_MAX_LENGTH} characters after formatting.`,
    details: {
      secretNames,
    },
  })

export const secretValuesTooLongError = (
  secretNames: Array<string>
): SecretValuesTooLongValidationError =>
  createSecretsError({
    code: 'validation.secret_values_too_long',
    message: `One or more secret values are too long. Secret value cannot be longer than ${SECRET_VALUE_MAX_LENGTH} characters after formatting.`,
    details: {
      secretNames,
    },
  })

export const noDataProvidedError = (): NoDataProvidedValidationError =>
  createSecretsError({
    details: undefined,
    code: 'validation.no_data_provided',
    message: 'At least one data item must be provided.',
  })
