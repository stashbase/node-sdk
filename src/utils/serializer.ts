type PlainObject = Record<string, unknown>

const isPlainObject = (value: unknown): value is PlainObject => {
  return typeof value === 'object' && value !== null && value.constructor === Object
}

/**
 * Convert camelCase to snake_case recursively.
 */
export const toSnakeCase = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    const mapped = (obj as unknown[]).map((value) => toSnakeCase(value))
    return mapped as T
  }

  if (obj instanceof Date || obj instanceof RegExp) {
    return obj
  }

  if (isPlainObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([A-Z])/g, (_match, letter: string, offset: number) =>
          offset === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`
        ),
        toSnakeCase(value),
      ])
    ) as T
  }

  return obj
}

/**
 * Convert snake_case to camelCase recursively.
 */
export const toCamelCase = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return obj
  }

  if (Array.isArray(obj)) {
    const mapped = (obj as unknown[]).map((value) => toCamelCase(value))
    return mapped as T
  }

  if (obj instanceof Date || obj instanceof RegExp) {
    return obj
  }

  if (isPlainObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/_([a-z])/gi, (_match, letter: string) => letter.toUpperCase()),
        toCamelCase(value),
      ])
    ) as T
  }

  return obj
}

export function stringToSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // camelCase → camel_case
    .replace(/[\s\-]+/g, '_') // spaces/dashes → _
    .toLowerCase()
}
