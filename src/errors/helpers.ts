export const ErrorPrefixes = {
  Validation: 'validation.',
  Conflict: 'conflict.',
  Resource: 'resource.',
  Quota: 'quota.',
  Auth: 'auth.',
  RateLimit: 'rate_limit.',
  Server: 'server.',
} as const

export function isValidationError(code?: string): boolean {
  if (!code) {
    return false
  }

  return code.startsWith(ErrorPrefixes.Validation)
}

export function isConflictError(code?: string): boolean {
  if (!code) {
    return false
  }

  return code.startsWith(ErrorPrefixes.Conflict)
}

export function isResourceError(code?: string): boolean {
  if (!code) {
    return false
  }

  return code.startsWith(ErrorPrefixes.Resource)
}

export function isQuotaError(code?: string): boolean {
  if (!code) {
    return false
  }

  return code.startsWith(ErrorPrefixes.Quota)
}

export function isAuthError(code?: string): boolean {
  if (!code) {
    return false
  }

  return code.startsWith(ErrorPrefixes.Auth)
}

export function isRateLimitError(code?: string): boolean {
  if (!code) {
    return false
  }

  return code.startsWith(ErrorPrefixes.RateLimit)
}

export function isServerError(code?: string): boolean {
  if (!code) {
    return false
  }

  return code.startsWith(ErrorPrefixes.Server)
}

export function isValidationErrorCode(code: string): code is `validation.${string}` {
  return code.startsWith(ErrorPrefixes.Validation)
}
