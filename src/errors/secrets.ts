import { ApiError } from '../http/response'
import {
  DuplicateNewSecretNamesError,
  DuplicateSecretsNamesError,
  InvalidNewSecretNamesError,
  InvalidSecretNameError,
  InvalidSecretNamesError,
  MissingPropertiesToUpdateError,
  NewSecretNamesSameAsNamesError,
  NoDataProvidedError,
  SecretCommentsTooLongError,
  SecretValuesTooLongError,
  SecretsErrorDetails,
} from '../types/errors/secrets'
import { SECRET_COMMENT_MAX_LENGTH, SECRET_VALUE_MAX_LENGTH } from '../utils/inputValidation'

export const createSecretsError = <T extends string, D = undefined | SecretsErrorDetails>(args: {
  code: T
  message: string
  details: D
}) => {
  return new ApiError(args.code, args.details, args.message)
}

export const secretNameFormatErrorMessage =
  'Secret names cannot start with a digit, only uppercase alphanumeric characters and underscores allowed, min 2 and max 255 characters.'

export const invalidSecretNamesError = (secretNames: Array<string>): InvalidSecretNamesError =>
  createSecretsError({
    code: 'validation.invalid_secret_names',
    message: secretNameFormatErrorMessage,
    details: {
      secretNames,
    },
  })

export const invalidSecretNameError = (): InvalidSecretNameError =>
  createSecretsError({
    code: 'validation.invalid_secret_name',
    message: secretNameFormatErrorMessage,
    details: undefined,
  })

export const duplicateSecretNamesError = (secretNames: Array<string>): DuplicateSecretsNamesError =>
  createSecretsError({
    code: 'validation.duplicate_secret_names',
    message: `One or more secrets with the same value of property 'name' provided in the request.`,
    details: {
      secretNames,
    },
  })

export const duplicateNewSecretNamesError = (
  secretNames: Array<string>
): DuplicateNewSecretNamesError =>
  createSecretsError({
    code: 'validation.duplicate_new_secret_names',
    message: `One or more secrets with the same value of property 'newName' provided in the request.`,
    details: {
      secretNames,
    },
  })

export const missingPropertiesToUpdateError = (
  secretNames: Array<string>
): MissingPropertiesToUpdateError =>
  createSecretsError({
    code: 'validation.missing_properties_to_update',
    message: 'At least one property to update must be provided.',
    details: {
      secretNames,
    },
  })

export const invalidNewSecretNamesError = (
  secretNames: Array<string>
): InvalidNewSecretNamesError =>
  createSecretsError({
    code: 'validation.invalid_new_secret_names',
    message: secretNameFormatErrorMessage,
    details: {
      secretNames,
    },
  })

export const newSecretNamesSameAsNamesError = (
  secretNames: Array<string>
): NewSecretNamesSameAsNamesError =>
  createSecretsError({
    code: 'validation.new_secret_names_same_as_names',
    message:
      "One or more values of property 'newName' match the provided 'name' values in the request.",
    details: {
      secretNames,
    },
  })

export const secretCommentsTooLongError = (
  secretNames: Array<string>
): SecretCommentsTooLongError =>
  createSecretsError({
    code: 'validation.secret_comments_too_long',
    message: `One or more secret comments are too long. Comment cannot be longer than ${SECRET_COMMENT_MAX_LENGTH} characters after formatting.`,
    details: {
      secretNames,
    },
  })

export const secretValuesTooLongError = (secretNames: Array<string>): SecretValuesTooLongError =>
  createSecretsError({
    code: 'validation.secret_values_too_long',
    message: `One or more secret values are too long. Secret value cannot be longer than ${SECRET_VALUE_MAX_LENGTH} characters.`,
    details: {
      secretNames,
    },
  })

export const noDataProvidedError = (): NoDataProvidedError =>
  createSecretsError({
    details: undefined,
    code: 'validation.no_data_provided',
    message: 'At least one data item must be provided.',
  })
