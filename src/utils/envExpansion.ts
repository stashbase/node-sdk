type ProcessEnv = Record<string, string | undefined>
type ParsedEnv = Record<string, string>

const resolveEscapeSequences = (value: string): string => {
  return value.replace(/\\\$/g, '$')
}

const expandValue = (value: string, processEnv: ProcessEnv, runningParsed: ParsedEnv): string => {
  const env: ProcessEnv = { ...runningParsed, ...processEnv }
  const regex = /(?<!\\)\${([^{}]+)}|(?<!\\)\$([A-Za-z_][A-Za-z0-9_]*)/g

  let result = value
  let match: RegExpExecArray | null
  const seen = new Set<string>()

  while ((match = regex.exec(result)) !== null) {
    seen.add(result)

    const [template, bracedExpression, unbracedExpression] = match
    const expression = (bracedExpression || unbracedExpression) as string

    const opRegex = /(:\+|\+|:-|-)/
    const opMatch = expression.match(opRegex)
    const splitter = opMatch ? opMatch[0] : null
    const parts = splitter ? expression.split(splitter) : [expression]

    const key = parts.shift() as string
    const defaultValue = splitter ? parts.join(splitter) : ''

    const resolvedValue = env[key]
    const useAltDefault = splitter === ':+'
    const useAltEmptyDefault = splitter === '+'

    let replacement: string

    if (useAltDefault || useAltEmptyDefault) {
      replacement = resolvedValue ? defaultValue : ''
    } else if (resolvedValue) {
      replacement = seen.has(resolvedValue) ? defaultValue : resolvedValue
    } else {
      replacement = defaultValue
    }

    result = result.replace(template, replacement)

    if (result === runningParsed[key]) {
      break
    }

    regex.lastIndex = 0
  }

  return result
}

export const expandAndInjectEnv = (parsed: ParsedEnv, processEnv: ProcessEnv = process.env) => {
  const runningParsed: ParsedEnv = {}

  for (const key in parsed) {
    const currentValue = parsed[key]
    const processValue = processEnv[key]

    const value =
      processValue && processValue !== currentValue
        ? processValue
        : expandValue(currentValue, processEnv, runningParsed)

    const normalized = resolveEscapeSequences(value)
    parsed[key] = normalized
    runningParsed[key] = normalized
  }

  for (const key in parsed) {
    processEnv[key] = parsed[key]
  }

  return parsed
}
