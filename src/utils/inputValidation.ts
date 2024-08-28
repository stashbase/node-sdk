import { UpdateSecretData } from '../api/workspace/secrets/handlers/update'
import {
  duplicateNewSecretKeysError,
  duplicateSecretKeysError,
  invalidNewSecretKeysError,
  invalidSecretKeysError,
  missingPropertiesToUpdateError,
  newKeysSameAsKeys,
  noDataProvidedError,
  selfReferencingSecretsError,
} from '../errors/secrets'
import {
  DuplicateNewSecretKeysValidationError,
  DuplicateSecretsKeysValidationError,
  InvalidNewSecretKeysValidationError,
  InvalidSecretKeysValidationError,
  MissingPropertiesToUpdateValidationError,
  NewSecretKeysSameAsKeysValidationError,
  NoDataProvidedValidationError,
  SelfReferencingSecretsValidationError,
} from '../types/errors/secrets'

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

//
function isAlphanumericUppercaseWithUnderscore(inputString: string): boolean {
  const pattern = /[^A-Z0-9_]/

  return !pattern.test(inputString)
}

type Resource = 'project' | 'environment' | 'webhook'

export const isResourceIdFormat = (resource: Resource, input: string) => {
  const prefix = resource === 'project' ? 'pr_' : resource === 'webhook' ? 'wh_' : 'ev_'

  if (input?.length !== 25 || !input.startsWith(prefix)) {
    return false
  }

  const idWithoutPrefix = input.slice(prefix.length)

  if (alphanumericRegex.test(idWithoutPrefix)) {
    return true
  } else {
    return false
  }
}

export const isValidWebhookId = (webhookId: string) => isResourceIdFormat('webhook', webhookId)

export const secretHasSelfReference = (secretKey: string, value: string): boolean => {
  const regex = /\${(.*?)}/g
  const matches = value.matchAll(regex)

  for (const match of matches) {
    if (match[1] === secretKey) {
      return true
    }
  }

  return false
}

export const extractAllSecretsReferences = (secretKey: string): string[] => {
  const regex = /\${(.*?)}/g
  const matches = secretKey.matchAll(regex)

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
  key: string
  value: string
  description?: string | null | undefined
}

type ValidateSetSecretsInputRes =
  | NoDataProvidedValidationError
  | InvalidSecretKeysValidationError
  | DuplicateSecretsKeysValidationError
  | SelfReferencingSecretsValidationError
  | null

// return api error
export const validateSetSecretsInput = (
  data: Array<SetSecretsItem>
): ValidateSetSecretsInputRes => {
  if (data?.length === 0) {
    const error = noDataProvidedError()
    return error
  }
  const invalidSecretKeys = new Set<string>()
  const keysWithSelfReference = new Set<string>()

  const keyOccurrences = new Map<string, number>()

  for (const { key, value, description: _ } of data) {
    const isValid = isValidSecretKey(key)
    if (!isValid) invalidSecretKeys.add(key)

    const hasSelfReference = secretHasSelfReference(key, value)

    if (hasSelfReference) {
      keysWithSelfReference.add(key)
    }

    keyOccurrences.set(key, (keyOccurrences.get(key) || 0) + 1)
  }

  if (invalidSecretKeys.size > 0) {
    const secretKeys = Array.from(invalidSecretKeys)
    const err = invalidSecretKeysError(secretKeys)
    return err
  }

  const duplicateSecretKeys = Array.from(keyOccurrences.entries())
    .filter(([, count]) => count > 1)
    ?.map(([key]) => key)

  if (duplicateSecretKeys?.length > 0) {
    const secretKeys = duplicateSecretKeys
    const error = duplicateSecretKeysError(secretKeys)

    return error
  }

  if (keysWithSelfReference.size > 0) {
    const secretKeys = Array.from(keysWithSelfReference)
    const error = selfReferencingSecretsError(secretKeys)

    return error
  }

  return null
}

export const validateCreateSecretsInput = validateSetSecretsInput

type ValidateUpdateSecretsInputRes =
  | NoDataProvidedValidationError
  | MissingPropertiesToUpdateValidationError
  | InvalidSecretKeysValidationError
  | InvalidNewSecretKeysValidationError
  | DuplicateSecretsKeysValidationError
  | DuplicateNewSecretKeysValidationError
  | SelfReferencingSecretsValidationError
  | NewSecretKeysSameAsKeysValidationError
  | null

export const validateUpdateSecretsInput = (
  data: UpdateSecretData[]
): ValidateUpdateSecretsInputRes => {
  if (data.length === 0) {
    const error = noDataProvidedError()
    return error
  }

  const keyOccurrences = new Map<string, number>()
  const newKeyOccurrences = new Map<string, number>()

  const keysWithSelfReference = new Set<string>()

  const invalidSecretKeys = new Set<string>()
  const invalidNewSecretKeys = new Set<string>()

  const newKeySameAsKey = new Set<string>()
  const missingPropertiesToUpdateKeys = new Set<string>()

  for (const { key, newKey, value, description } of data) {
    if (newKey === undefined && value === undefined && description === undefined) {
      missingPropertiesToUpdateKeys.add(key)
    }

    if (!isValidSecretKey(key)) {
      invalidSecretKeys.add(key)
    }

    if (newKey !== undefined && !isValidSecretKey(newKey)) {
      invalidNewSecretKeys.add(key)
    }

    if (value) {
      if (newKey) {
        const hasSelfReference = secretHasSelfReference(newKey, value)

        if (hasSelfReference) {
          keysWithSelfReference.add(key)
        }
      } else {
        const hasSelfReference = secretHasSelfReference(key, value)

        if (hasSelfReference) {
          keysWithSelfReference.add(key)
        }
      }
    }

    keyOccurrences.set(key, (keyOccurrences.get(key) || 0) + 1)

    if (newKey !== undefined) {
      newKeyOccurrences.set(newKey, (newKeyOccurrences.get(newKey) || 0) + 1)

      if (key === newKey) {
        newKeySameAsKey.add(key)
      }
    }
  }
  // NOTE: invalid keys
  if (invalidSecretKeys.size > 0) {
    const error = invalidSecretKeysError(Array.from(invalidSecretKeys))
    return error
  }

  // NOTE: invalid new secret keys
  if (invalidNewSecretKeys.size > 0) {
    const secretKeys = Array.from(invalidNewSecretKeys)
    const error = invalidNewSecretKeysError(secretKeys)

    return error
  }

  // NOTE: missing properties to update
  if (missingPropertiesToUpdateKeys.size > 0) {
    const error = missingPropertiesToUpdateError(Array.from(missingPropertiesToUpdateKeys))
    return error
  }

  // NOTE: duplicate secrets
  const duplicateSecretKeys = Array.from(keyOccurrences.entries())
    .filter(([_, count]) => count > 1)
    ?.map(([key]) => key)

  if (duplicateSecretKeys?.length > 0) {
    const secretKeys = duplicateSecretKeys
    const error = duplicateSecretKeysError(secretKeys)

    return error
  }

  // NOTE: duplicate new secrets
  const duplicateNewSecrets = Array.from(newKeyOccurrences.entries())
    .filter(([_, count]) => count > 1)
    ?.map(([key]) => key)

  if (duplicateNewSecrets?.length > 0) {
    const error = duplicateNewSecretKeysError(duplicateNewSecrets)
    return error
  }

  if (newKeySameAsKey.size > 0) {
    const error = newKeysSameAsKeys([...newKeySameAsKey.keys()])
    return error
  }

  // NOTE: self-referencing secrets
  if (keysWithSelfReference.size > 0) {
    const secretKeys = Array.from(keysWithSelfReference)
    const error = selfReferencingSecretsError(secretKeys)

    return error
  }

  return null
}

export const validateSecretKeys = (data: Array<string>): { invalidSecretKeys: Array<string> } => {
  const invalidSecretKeys = new Set<string>()

  for (const key of data) {
    if (!isValidSecretKey(key)) {
      invalidSecretKeys.add(key)
    }
  }

  return { invalidSecretKeys: Array.from(invalidSecretKeys) }
}

const isValidSecretKey = (key: string) =>
  key.length >= 2 &&
  key.length < 255 &&
  isAlphanumericUppercaseWithUnderscore(key) &&
  !startsWithNumber(key)

export { isValidProjectName, isValidProjectIdentifier, isValidEnvironmentName, isValidSecretKey }
