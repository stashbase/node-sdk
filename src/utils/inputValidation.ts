import { UpdateSecretData } from '../api/workspace/secrets/handlers/update'
import { ApiError } from '../http/response'

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
  | ApiError<'invalid_secret_key' | 'duplicate_keys' | 'no_values_provided'>
  | ApiError<'self_referencing_secrets'>
  | null

// return api error
export const validateSetSecretsInput = (
  data: Array<SetSecretsItem>
): ValidateSetSecretsInputRes => {
  if (data?.length === 0) {
    return { code: 'no_values_provided' }
  }

  const allKeys: string[] = []

  const keysWithSelfReference = new Set<string>()

  for (const { key, value, description: _ } of data) {
    const trimmedKey = key.trim()
    const isValidKey = isValidSecretKey(trimmedKey)

    if (!isValidKey) {
      return { code: 'invalid_secret_key' }
    }

    const hasSelfReference = secretHasSelfReference(key, value)

    if (hasSelfReference) {
      keysWithSelfReference.add(key)
    }

    allKeys.push(trimmedKey)
  }

  const allUniqueKeys = new Set(allKeys)

  if (allUniqueKeys.size !== allKeys.length) {
    return { code: 'duplicate_keys' }
  }

  if (keysWithSelfReference.size > 0) {
    // return secretsError.selfReferencingSecrets([...keysWithSelfReference.keys()])
    return { code: 'self_referencing_secrets' }
  }

  return null
}

export const validateCreateSecretsInput = validateSetSecretsInput

type ValidateUpdateSecretsInputRes =
  | ApiError<
      | 'invalid_secret_key'
      | 'duplicate_keys'
      | 'duplicate_new_keys'
      | 'no_values_provided'
      | 'missing_properties'
    >
  | ApiError<'self_referencing_secrets'>
  | null

export const validateUpdateSecretsInput = (
  data: UpdateSecretData[]
): ValidateUpdateSecretsInputRes => {
  if (data.length === 0) {
    return { code: 'no_values_provided' }
  }

  const newKeys: string[] = []
  const keys: string[] = []

  const newKeysWithSelfReference = new Set<string>()
  const keysWithSelfReference = new Set<string>()

  for (const secret of data) {
    if (
      !isValidSecretKey(secret.key) ||
      (secret.newKey !== undefined && !isValidSecretKey(secret.newKey))
    ) {
      return { code: 'invalid_secret_key' }
    }

    if (
      secret.newKey === undefined &&
      secret.value === undefined &&
      secret.description === undefined
    ) {
      return { code: 'missing_properties' }
    }

    keys.push(secret.key)
    if (secret.newKey !== undefined) {
      newKeys.push(secret.newKey)
    }

    if (secret.value) {
      if (secret.key) {
        const hasSelfReference = secretHasSelfReference(secret.key, secret.value)

        if (hasSelfReference) {
          keysWithSelfReference.add(secret.key)
        }
      }

      if (secret.newKey) {
        const hasSelfReference = secretHasSelfReference(secret.newKey, secret.value)

        if (hasSelfReference) {
          newKeysWithSelfReference.add(secret.newKey)
        }
      }
    }
  }

  // NOTE: key duplicates
  const duplicateKeysInput = keys.filter((item, index) => keys.indexOf(item) !== index)
  const uniqueDuplicateKeys = new Set(duplicateKeysInput)

  if (uniqueDuplicateKeys.size > 0) {
    return { code: 'duplicate_keys' }
  }

  // NOTE: new key duplicates
  const duplicateNewKeysInput = newKeys.filter((item, index) => newKeys.indexOf(item) !== index)
  const uniqueNewDuplicateKeys = new Set(duplicateNewKeysInput)

  if (uniqueNewDuplicateKeys.size > 0) {
    return { code: 'duplicate_new_keys' }
  }

  if (keysWithSelfReference.size > 0) {
    // selfReferencingSecrets([...newKeysWithSelfReference.keys()])
    return { code: 'self_referencing_secrets' }
  }

  if (newKeysWithSelfReference.size > 0) {
    // selfReferencingSecrets([...newKeysWithSelfReference.keys()])
    return { code: 'self_referencing_secrets' }
  }

  return null
}

const isValidSecretKey = (key: string) =>
  key.length >= 2 &&
  key.length < 255 &&
  isAlphanumericUppercaseWithUnderscore(key) &&
  !startsWithNumber(key)

export { isValidProjectName, isValidEnvironmentName, isValidSecretKey }
