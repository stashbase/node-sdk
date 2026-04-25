import { ApiError } from '../http/response'
import {
  DuplicateNewSecretNamesErrorCode,
  DuplicateSecretsNamesErrorCode,
  InvalidNewSecretNamesErrorCode,
  InvalidSecretNameErrorCode,
  MissingPropertiesToUpdateErrorCode,
  NewSecretNamesSameAsNamesErrorCode,
  NoDataProvidedErrorCode,
  SearchRequiresNameOrValueErrorCode,
  SearchSecretNameAndValueMutuallyExclusiveErrorCode,
  SecretCommentsTooLongErrorCode,
  SecretValuesTooLongErrorCode,
  InvalidSecretNamesErrorCode,
} from '../types/errors/secrets'
import { SECRET_COMMENT_MAX_LENGTH, SECRET_VALUE_MAX_LENGTH } from '../utils/inputValidation'

const createSecretsError = <TCode extends string>(args: {
  code: TCode
  message: string
  details?: unknown
}): ApiError<TCode> => {
  return {
    code: args.code,
    details: args.details,
    message: args.message,
  }
}

export const secretNameFormatErrorMessage =
  'Secret names cannot start with a digit, only uppercase alphanumeric characters and underscores allowed, min 2 and max 255 characters.'

export const invalidSecretNamesError = (secretNames: Array<string>): ApiError<InvalidSecretNamesErrorCode> =>
  createSecretsError({
    code: 'validation.invalid_secret_names',
    message: secretNameFormatErrorMessage,
    details: {
      secretNames,
    },
  })

export const invalidSecretNameError = (): ApiError<InvalidSecretNameErrorCode> =>
  createSecretsError({
    code: 'validation.invalid_secret_name',
    message: secretNameFormatErrorMessage,
  })

export const duplicateSecretNamesError = (
  secretNames: Array<string>
): ApiError<DuplicateSecretsNamesErrorCode> =>
  createSecretsError({
    code: 'validation.duplicate_secret_names',
    message: "One or more secrets with the same value of property 'name' provided in the request.",
    details: {
      secretNames,
    },
  })

export const duplicateNewSecretNamesError = (
  secretNames: Array<string>
): ApiError<DuplicateNewSecretNamesErrorCode> =>
  createSecretsError({
    code: 'validation.duplicate_new_secret_names',
    message: "One or more secrets with the same value of property 'newName' provided in the request.",
    details: {
      secretNames,
    },
  })

export const missingPropertiesToUpdateError = (
  secretNames: Array<string>
): ApiError<MissingPropertiesToUpdateErrorCode> =>
  createSecretsError({
    code: 'validation.missing_properties_to_update',
    message: 'At least one property to update must be provided.',
    details: {
      secretNames,
    },
  })

export const invalidNewSecretNamesError = (
  secretNames: Array<string>
): ApiError<InvalidNewSecretNamesErrorCode> =>
  createSecretsError({
    code: 'validation.invalid_new_secret_names',
    message: secretNameFormatErrorMessage,
    details: {
      secretNames,
    },
  })

export const newSecretNamesSameAsNamesError = (
  secretNames: Array<string>
): ApiError<NewSecretNamesSameAsNamesErrorCode> =>
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
): ApiError<SecretCommentsTooLongErrorCode> =>
  createSecretsError({
    code: 'validation.secret_comments_too_long',
    message: `One or more secret comments are too long. Comment cannot be longer than ${SECRET_COMMENT_MAX_LENGTH} characters after formatting.`,
    details: {
      secretNames,
    },
  })

export const secretValuesTooLongError = (
  secretNames: Array<string>
): ApiError<SecretValuesTooLongErrorCode> =>
  createSecretsError({
    code: 'validation.secret_values_too_long',
    message: `One or more secret values are too long. Secret value cannot be longer than ${SECRET_VALUE_MAX_LENGTH} characters.`,
    details: {
      secretNames,
    },
  })

export const noDataProvidedError = (): ApiError<NoDataProvidedErrorCode> =>
  createSecretsError({
    code: 'validation.no_data_provided',
    message: 'At least one data item must be provided.',
  })

export const searchRequiresNameOrValueError = (
  requiredQueryParamsAnyOf: string[]
): ApiError<SearchRequiresNameOrValueErrorCode> =>
  createSecretsError({
    code: 'validation.search_requires_name_or_value',
    message: "Search requires at least one query parameter: provide 'name' or 'value'.",
    details: {
      requiredQueryParamsAnyOf,
    },
  })

export const searchSecretNameAndValueMutuallyExclusiveError =
  (): ApiError<SearchSecretNameAndValueMutuallyExclusiveErrorCode> =>
    createSecretsError({
      code: 'validation.search_secret_name_and_value_mutually_exclusive',
      message: "Only one of 'name' or 'value' query parameter can be provided.",
    })
