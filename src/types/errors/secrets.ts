import { GlobalErrorCode } from './index'

export type SecretNotFoundErrorCode = 'resource.secret_not_found'
export type NoDataProvidedErrorCode = 'validation.no_data_provided'
export type InvalidSecretNameErrorCode = 'validation.invalid_secret_name'
export type InvalidSecretNamesErrorCode = 'validation.invalid_secret_names'
export type DuplicateSecretsNamesErrorCode = 'validation.duplicate_secret_names'
export type SecretCommentsTooLongErrorCode = 'validation.secret_comments_too_long'
export type SecretValuesTooLongErrorCode = 'validation.secret_values_too_long'
export type DuplicateNewSecretNamesErrorCode = 'validation.duplicate_new_secret_names'
export type InvalidNewSecretNamesErrorCode = 'validation.invalid_new_secret_names'
export type NewSecretNamesSameAsNamesErrorCode = 'validation.new_secret_names_same_as_names'
export type MissingPropertiesToUpdateErrorCode = 'validation.missing_properties_to_update'
export type SecretsAlreadyExistErrorCode = 'validation.secrets_already_exist'
export type SearchRequiresNameOrValueErrorCode = 'validation.search_requires_name_or_value'
export type SearchSecretNameAndValueMutuallyExclusiveErrorCode =
  'validation.search_secret_name_and_value_mutually_exclusive'

export type CreateSecretsErrorCode =
  | GlobalErrorCode
  | NoDataProvidedErrorCode
  | InvalidSecretNamesErrorCode
  | DuplicateSecretsNamesErrorCode
  | SecretCommentsTooLongErrorCode
  | SecretValuesTooLongErrorCode

export type DeleteSecretsErrorCode =
  | GlobalErrorCode
  | NoDataProvidedErrorCode
  | InvalidSecretNamesErrorCode

export type GetSecretErrorCode = GlobalErrorCode | SecretNotFoundErrorCode | InvalidSecretNameErrorCode

export type ListSecretsErrorCode = GlobalErrorCode

export type SearchSecretsErrorCode =
  | GlobalErrorCode
  | InvalidSecretNameErrorCode
  | SearchRequiresNameOrValueErrorCode
  | SearchSecretNameAndValueMutuallyExclusiveErrorCode

export type ListOnlySecretsErrorCode =
  | ListSecretsErrorCode
  | NoDataProvidedErrorCode
  | InvalidSecretNamesErrorCode

export type ListExcludeSecretsErrorCode =
  | ListSecretsErrorCode
  | NoDataProvidedErrorCode
  | InvalidSecretNamesErrorCode

export type SetSecretsErrorCode =
  | GlobalErrorCode
  | NoDataProvidedErrorCode
  | InvalidSecretNamesErrorCode
  | DuplicateSecretsNamesErrorCode
  | SecretCommentsTooLongErrorCode
  | SecretValuesTooLongErrorCode

export type UpdateSecretsErrorCode =
  | GlobalErrorCode
  | NoDataProvidedErrorCode
  | InvalidSecretNamesErrorCode
  | DuplicateSecretsNamesErrorCode
  | DuplicateNewSecretNamesErrorCode
  | InvalidNewSecretNamesErrorCode
  | MissingPropertiesToUpdateErrorCode
  | SecretCommentsTooLongErrorCode
  | SecretValuesTooLongErrorCode
  | SecretsAlreadyExistErrorCode
  | NewSecretNamesSameAsNamesErrorCode
