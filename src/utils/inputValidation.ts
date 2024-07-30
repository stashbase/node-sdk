import { UpdateSecretData } from '../api/workspace/secrets/handlers/update'
import { ApiError } from '../http/response'
import { SecretKey } from '../types/secretKey'

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
  isAlphanumericWithHyphensAndUnderscores(projectName) && projectName.length >= 2

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
  containsMaxOneDash(environmentName) &&
  isAlphanumericWithHyphensAndUnderscores(environmentName)

//
function isAlphanumericUppercaseWithUnderscore(inputString: string): boolean {
  const pattern = /[^A-Z0-9_]/

  return !pattern.test(inputString)
}

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
  | ApiError<'no_values_provided'>
  | ApiError<'invalid_secret_keys', { secretKeys: Array<string> }>
  | ApiError<'duplicate_secrets', { duplicateSecrets: Array<string> }>
  | ApiError<'self_referencing_secrets', { secrets: Array<string> }>
  | null

// return api error
export const validateSetSecretsInput = (
  data: Array<SetSecretsItem>
): ValidateSetSecretsInputRes => {
  if (data?.length === 0) {
    return { code: 'no_values_provided', details: undefined }
  }
  const invalidSecretKeys = new Set<string>()
  const keysWithSelfReference = new Set<string>()

  const keyOccurrences = new Map<string, number>()

  for (const { key, value, description: _ } of data) {
    const trimmedKey = key.trim()
    const isValid = isValidSecretKey(trimmedKey)

    if (isValid) invalidSecretKeys.add(key)

    const hasSelfReference = secretHasSelfReference(key, value)

    if (hasSelfReference) {
      keysWithSelfReference.add(key)
    }

    const keyOccurrenceCount = keyOccurrences.get(key)

    if (keyOccurrenceCount !== undefined) {
      keyOccurrences.set(key, keyOccurrenceCount + 1)
    } else {
      keyOccurrences.set(key, 1)
    }
  }

  if (invalidSecretKeys.size > 0) {
    return { code: 'invalid_secret_keys', details: { secretKeys: Array.from(invalidSecretKeys) } }
  }

  const duplicateSecretKeys = Array.from(keyOccurrences.entries())
    .filter(([, count]) => count > 1)
    ?.map(([key]) => key)

  if (duplicateSecretKeys?.length > 0) {
    return { code: 'duplicate_secrets', details: { duplicateSecrets: duplicateSecretKeys } }
  }

  if (keysWithSelfReference.size > 0) {
    return {
      code: 'self_referencing_secrets',
      details: { secrets: Array.from(keysWithSelfReference) },
    }
  }

  return null
}

export const validateCreateSecretsInput = validateSetSecretsInput

type ValidateUpdateSecretsInputRes =
  | ApiError<'no_values_provided'>
  | ApiError<'missing_properties_to_update', { secretKeys: Array<string> }>
  | ApiError<'invalid_secret_keys', { secretKeys: Array<string> }>
  | ApiError<'invalid_new_secret_keys', { newSecretKeys: Array<string> }>
  | ApiError<'duplicate_secrets', { duplicateSecrets: Array<string> }>
  | ApiError<'duplicate_new_secrets', { duplicateSecrets: Array<string> }>
  | ApiError<'self_referencing_secrets', { secrets: Array<string> }>
  | null

export const validateUpdateSecretsInput = (
  data: UpdateSecretData[]
): ValidateUpdateSecretsInputRes => {
  if (data.length === 0) {
    return { code: 'no_values_provided', details: undefined }
  }

  const keyOccurrences = new Map<string, number>()
  const newKeyOccurrences = new Map<string, number>()

  const newKeysWithSelfReference = new Set<string>()
  const keysWithSelfReference = new Set<string>()

  const invalidSecretKeys = new Set<string>()
  const invalidNewSecretKeys = new Set<string>()

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
      if (key) {
        const hasSelfReference = secretHasSelfReference(key, value)

        if (hasSelfReference) {
          keysWithSelfReference.add(key)
        }
      }

      if (newKey) {
        const hasSelfReference = secretHasSelfReference(newKey, value)

        if (hasSelfReference) {
          newKeysWithSelfReference.add(newKey)
        }
      }
    }

    const keyOccurrenceCount = keyOccurrences.get(key)

    if (keyOccurrenceCount !== undefined) {
      keyOccurrences.set(key, keyOccurrenceCount + 1)
    } else {
      keyOccurrences.set(key, 1)
    }

    if (newKey === undefined) continue

    const newKeyOccurrenceCount = newKeyOccurrences.get(newKey)

    if (newKeyOccurrenceCount !== undefined) {
      newKeyOccurrences.set(newKey, newKeyOccurrenceCount + 1)
    } else {
      newKeyOccurrences.set(newKey, 1)
    }
  }

  // NOTE: missing properties to update
  if (missingPropertiesToUpdateKeys.size > 0) {
    return {
      code: 'missing_properties_to_update',
      details: { secretKeys: Array.from(missingPropertiesToUpdateKeys) },
    }
  }

  // NOTE: invalid keys
  if (invalidSecretKeys.size > 0) {
    return { code: 'invalid_secret_keys', details: { secretKeys: Array.from(invalidSecretKeys) } }
  }

  // NOTE: invalid new secret keys
  if (invalidNewSecretKeys.size > 0) {
    return {
      code: 'invalid_new_secret_keys',
      details: { newSecretKeys: Array.from(invalidNewSecretKeys) },
    }
  }

  // NOTE: duplicate secrets
  const duplicateSecretKeys = Array.from(keyOccurrences.entries())
    .filter(([_, count]) => count > 1)
    ?.map(([key]) => key)

  if (duplicateSecretKeys?.length > 0) {
    return { code: 'duplicate_secrets', details: { duplicateSecrets: duplicateSecretKeys } }
  }

  // NOTE: duplicate new secrets
  const duplicateNewSecrets = Array.from(newKeyOccurrences.entries())
    .filter(([_, count]) => count > 1)
    ?.map(([key]) => key)

  if (duplicateNewSecrets?.length > 0) {
    return {
      code: 'duplicate_new_secrets',
      details: { duplicateSecrets: duplicateNewSecrets },
    }
  }

  // NOTE: self-referencing secrets
  if (keysWithSelfReference.size > 0) {
    return {
      code: 'self_referencing_secrets',
      details: { secrets: Array.from(keysWithSelfReference) },
    }
  }

  // NOTE: self-referencing new secrets
  if (newKeysWithSelfReference.size > 0) {
    return {
      code: 'self_referencing_secrets',
      details: { secrets: Array.from(newKeysWithSelfReference) },
    }
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

export { isValidProjectName, isValidEnvironmentName, isValidSecretKey }
