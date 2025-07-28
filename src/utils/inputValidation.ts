import { UpdateSecretsData } from '../api/environments/handlers/secrets/update'
import {
  duplicateNewSecretNamesError,
  duplicateSecretNamesError,
  invalidNewSecretNamesError,
  invalidSecretNamesError,
  missingPropertiesToUpdateError,
  newSecretNamesSameAsNamesError,
  noDataProvidedError,
  secretCommentsTooLongError,
  secretValuesTooLongError,
} from '../errors/secrets'
import { invalidWebhookIdError } from '../errors/webhooks'
import { responseFailure } from '../http/response'
import {
  DuplicateNewSecretNamesValidationError,
  DuplicateSecretsNamesValidationError,
  InvalidNewSecretNamesValidationError,
  InvalidSecretNamesValidationError,
  MissingPropertiesToUpdateValidationError,
  NewSecretNamesSameAsNamesValidationError,
  NoDataProvidedValidationError,
  SecretCommentsTooLongValidationError,
  SecretValuesTooLongValidationError,
} from '../types/errors/secrets'

export const SECRET_COMMENT_MAX_LENGTH = 512
export const SECRET_VALUE_MAX_LENGTH = 4096

const alphanumericRegex = /[a-zA-Z0-9]/

export function containsMaxOneDash(str: string) {
  // return /^(?!-$)(?!.*--)[^-]*(?:-(?!$)[^-]*)?$/.test(str);
  return /^(?!-)(?!.*--)[^-]*(?:-(?!$)[^-]*)?$/.test(str)
}

export const startsWithNumber = (str: string) => {
  if (/^[0-9]/.test(str)) {
    return true
  }

  return false
}

function isAlphanumericWithHyphensAndUnderscores(inputString: string): boolean {
  const pattern = /^[a-zA-Z0-9_-]*$/

  return pattern.test(inputString)
}

export const removeOuterNewlines = (str: string) => str.replace(/^\n+|\n+$/g, '')

// TODO: validate max length
const isValidProjectName = (projectName: string) =>
  projectName.length >= 2 &&
  projectName.length <= 40 &&
  isAlphanumericWithHyphensAndUnderscores(projectName)

const isValidProjectIdentifier = isValidProjectName

//

// function isAlphanumericWithHyphensAndUnderscores(inputString: string): boolean {
//   const pattern = /[^a-zA-Z0-9-_]/
//
//   return !pattern.test(inputString)
// }
//
// function isAlphanumericWithHyphens(inputString: string): boolean {
//   const pattern = /[^a-zA-Z0-9-]/
//
//   return !pattern.test(inputString)
// }
//
// function isAlphanumericWithUnderscores(inputString: string): boolean {
//   const pattern = /[^a-zA-Z0-9_]/
//
//   return !pattern.test(inputString)
// }

const isValidEnvironmentName = (environmentName: string) =>
  environmentName.length >= 2 &&
  environmentName.length <= 40 &&
  containsMaxOneDash(environmentName) &&
  isAlphanumericWithHyphensAndUnderscores(environmentName)

export const isValidEnvironmentIdentifier = isValidEnvironmentName

//
function isAlphanumericUppercaseWithUnderscore(inputString: string): boolean {
  const pattern = /[^A-Z0-9_]/

  return !pattern.test(inputString)
}

type Resource = 'project' | 'environment' | 'webhook'

const resourcePrefixes = {
  project: 'proj_',
  webhook: 'whk_',
  environment: 'env_',
}

export const isResourceIdFormat = (resource: Resource, input: string) => {
  const prefix = resourcePrefixes[resource]

  if (!input.startsWith(prefix)) {
    return false
  }

  const idWithoutPrefix = input.slice(prefix.length)

  if (idWithoutPrefix.length === 22 && alphanumericRegex.test(idWithoutPrefix)) {
    return true
  } else {
    return false
  }
}

export const isValidWebhookId = (webhookId: string) => isResourceIdFormat('webhook', webhookId)

export const isValidHttpsUrl = (url: string): boolean => {
  const httpsUrlPattern = /^https:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/
  return httpsUrlPattern.test(url)
}

export const isValidWebhookDescription = (description: string): boolean => {
  const maxLength = 255
  return description.length <= maxLength
}

export const validateWebhookIdForMethod = (webhookId: string) => {
  const isValid = isValidWebhookId(webhookId)

  if (!isValid) {
    const error = invalidWebhookIdError
    return responseFailure(error)
  }
}

// export const secretHasSelfReference = (secretName: string, value: string): boolean => {
//   const regex = /\${(.*?)}/g
//   const matches = value.matchAll(regex)

//   for (const match of matches) {
//     if (match[1] === secretName) {
//       return true
//     }
//   }

//   return false
// }

export const extractAllSecretsReferences = (secretName: string): string[] => {
  const regex = /\${(.*?)}/g
  const matches = secretName.matchAll(regex)

  // Using a Set to store unique references
  const refs = new Set<string>()
  for (const match of matches) {
    refs.add(match[1]) // match[1] contains the captured group inside ${}
  }

  // Converting the Set back to an array
  const uniqueRefs = Array.from(refs)

  return uniqueRefs
}

interface SetSecretsItem {
  name: string
  value: string
  comment?: string | null | undefined
}

type ValidateSetSecretsInputRes =
  | NoDataProvidedValidationError
  | InvalidSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | SecretCommentsTooLongValidationError
  | SecretValuesTooLongValidationError
  | null

// return api error
export const validateSetSecretsInput = (
  data: Array<SetSecretsItem>
): ValidateSetSecretsInputRes => {
  if (data?.length === 0) {
    const error = noDataProvidedError()
    return error
  }
  const invalidSecretNames = new Set<string>()
  const commentTooLongSecretNames = new Set<string>()
  const valueTooLongSecretNames = new Set<string>()
  const nameOccurrences = new Map<string, number>()

  for (const { name, value, comment } of data) {
    const isValid = isValidSecretName(name)
    if (!isValid) invalidSecretNames.add(name)

    nameOccurrences.set(name, (nameOccurrences.get(name) || 0) + 1)

    if (value.length > SECRET_VALUE_MAX_LENGTH) {
      valueTooLongSecretNames.add(name)
    }

    if (comment && comment.length > SECRET_COMMENT_MAX_LENGTH) {
      commentTooLongSecretNames.add(name)
    }
  }

  if (invalidSecretNames.size > 0) {
    const secretNames = Array.from(invalidSecretNames)
    const err = invalidSecretNamesError(secretNames)
    return err
  }

  const duplicateSecretNames = Array.from(nameOccurrences.entries())
    .filter(([, count]) => count > 1)
    ?.map(([name]) => name)

  if (duplicateSecretNames?.length > 0) {
    const secretNames = duplicateSecretNames
    const error = duplicateSecretNamesError(secretNames)

    return error
  }

  if (valueTooLongSecretNames.size > 0) {
    const secretNames = Array.from(valueTooLongSecretNames)
    const error = secretValuesTooLongError(secretNames)

    return error
  }

  if (commentTooLongSecretNames.size > 0) {
    const secretNames = Array.from(commentTooLongSecretNames)
    const error = secretCommentsTooLongError(secretNames)

    return error
  }

  return null
}

export const validateCreateSecretsInput = validateSetSecretsInput

type ValidateUpdateSecretsInputRes =
  | NoDataProvidedValidationError
  | MissingPropertiesToUpdateValidationError
  | InvalidSecretNamesValidationError
  | InvalidNewSecretNamesValidationError
  | DuplicateSecretsNamesValidationError
  | DuplicateNewSecretNamesValidationError
  | NewSecretNamesSameAsNamesValidationError
  | SecretCommentsTooLongValidationError
  | SecretValuesTooLongValidationError
  | null

export const validateUpdateSecretsInput = (
  data: UpdateSecretsData
): ValidateUpdateSecretsInputRes => {
  if (data.length === 0) {
    const error = noDataProvidedError()
    return error
  }

  const nameOccurrences = new Map<string, number>()
  const newNameOccurrences = new Map<string, number>()

  const invalidSecretNames = new Set<string>()
  const invalidNewSecretNames = new Set<string>()

  const newNameSameAsName = new Set<string>()
  const missingPropertiesToUpdateNames = new Set<string>()
  const commentTooLongSecretNames = new Set<string>()
  const valueTooLongSecretNames = new Set<string>()

  for (const { name, newName, value, comment } of data) {
    if (newName === undefined && value === undefined && comment === undefined) {
      missingPropertiesToUpdateNames.add(name)
    }

    if (!isValidSecretName(name)) {
      invalidSecretNames.add(name)
    }

    if (newName !== undefined && !isValidSecretName(newName)) {
      invalidNewSecretNames.add(newName)
    }

    nameOccurrences.set(name, (nameOccurrences.get(name) || 0) + 1)

    if (newName !== undefined) {
      newNameOccurrences.set(newName, (newNameOccurrences.get(newName) || 0) + 1)

      if (name === newName) {
        newNameSameAsName.add(name)
      }
    }

    if (value && value.length > SECRET_VALUE_MAX_LENGTH) {
      valueTooLongSecretNames.add(name)
    }

    if (comment && comment.length > SECRET_COMMENT_MAX_LENGTH) {
      commentTooLongSecretNames.add(name)
    }
  }
  // NOTE: invalid names
  if (invalidSecretNames.size > 0) {
    const error = invalidSecretNamesError(Array.from(invalidSecretNames))
    return error
  }

  // NOTE: invalid new secret names
  if (invalidNewSecretNames.size > 0) {
    const secretNames = Array.from(invalidNewSecretNames)
    const error = invalidNewSecretNamesError(secretNames)

    return error
  }

  // NOTE: missing properties to update
  if (missingPropertiesToUpdateNames.size > 0) {
    const error = missingPropertiesToUpdateError(Array.from(missingPropertiesToUpdateNames))
    return error
  }

  // NOTE: duplicate secrets
  const duplicateSecretNames = Array.from(nameOccurrences.entries())
    .filter(([_, count]) => count > 1)
    ?.map(([name]) => name)

  if (duplicateSecretNames?.length > 0) {
    const secretNames = duplicateSecretNames
    const error = duplicateSecretNamesError(secretNames)

    return error
  }

  // NOTE: duplicate new secrets
  const duplicateNewSecrets = Array.from(newNameOccurrences.entries())
    .filter(([_, count]) => count > 1)
    ?.map(([name]) => name)

  if (duplicateNewSecrets?.length > 0) {
    const error = duplicateNewSecretNamesError(duplicateNewSecrets)
    return error
  }

  if (newNameSameAsName.size > 0) {
    const error = newSecretNamesSameAsNamesError([...newNameSameAsName.keys()])
    return error
  }

  // NOTE: value too long
  if (valueTooLongSecretNames.size > 0) {
    const secretNames = Array.from(valueTooLongSecretNames)
    const error = secretValuesTooLongError(secretNames)

    return error
  }

  if (commentTooLongSecretNames.size > 0) {
    const secretNames = Array.from(commentTooLongSecretNames)
    const error = secretCommentsTooLongError(secretNames)

    return error
  }

  return null
}

export const validateSecretNames = (
  names: Array<string>
): { invalidSecretNames: Array<string> } => {
  const invalidSecretNames = new Set<string>()

  for (const name of names) {
    if (!isValidSecretName(name)) {
      invalidSecretNames.add(name)
    }
  }

  return { invalidSecretNames: Array.from(invalidSecretNames) }
}

const isValidSecretName = (name: string) =>
  name.length >= 2 &&
  name.length < 255 &&
  isAlphanumericUppercaseWithUnderscore(name) &&
  !startsWithNumber(name)

// format comments for secrets
export const formatSecretComments = <T extends { comment?: string | null }>(
  data: Array<T>
): Array<T> => {
  return data.map(({ comment: c, ...rest }) => ({
    ...rest,
    comment: c !== undefined && c !== null ? formatSecretComment(c) : c,
  })) as T[]
}

export const formatSecretComment = (comment: string) => {
  return removeOuterNewlines(
    comment
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
  )
}

export const formatSecretsInputArray = <T extends { comment?: string | null }>(
  data: Array<T>
): Array<T> => {
  return data.map(({ comment: c, ...rest }) => ({
    ...rest,
    comment: c !== undefined && c !== null ? formatSecretComment(c) : c,
  })) as T[]
}

export { isValidProjectName, isValidProjectIdentifier, isValidEnvironmentName, isValidSecretName }
