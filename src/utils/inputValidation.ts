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

  const keysWithSelfReference = new Map<string, null>()

  for (const { key, value, description: _ } of data) {
    const trimmedKey = key.trim()
    const isValidKey = isValidSecretKey(trimmedKey)

    if (!isValidKey) {
      return { code: 'invalid_secret_key' }
    }

    const hasSelfReference = secretHasSelfReference(key, value)

    if (hasSelfReference) {
      keysWithSelfReference.set(key, null)
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

const isValidSecretKey = (key: string) =>
  key.length >= 2 &&
  key.length < 255 &&
  isAlphanumericUppercaseWithUnderscore(key) &&
  !startsWithNumber(key)

export { isValidProjectName, isValidEnvironmentName, isValidSecretKey }
