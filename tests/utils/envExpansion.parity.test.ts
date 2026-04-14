import { assert, describe, test } from 'vitest'
import dotenvExpand from 'dotenv-expand'
import { expandAndInjectEnv } from '../../src/utils/envExpansion'

type ParityCase = {
  name: string
  parsed: Record<string, string>
  processEnv?: Record<string, string | undefined>
}

const runDotenvExpand = (args: {
  parsed: Record<string, string>
  processEnv: Record<string, string | undefined>
}) => {
  const parsed = { ...args.parsed }
  const processEnv = { ...args.processEnv }

  dotenvExpand.expand({ parsed, processEnv })

  return { parsed, processEnv }
}

const runCustomExpand = (args: {
  parsed: Record<string, string>
  processEnv: Record<string, string | undefined>
}) => {
  const parsed = { ...args.parsed }
  const processEnv = { ...args.processEnv }

  expandAndInjectEnv(parsed, processEnv)

  return { parsed, processEnv }
}

describe('expandAndInjectEnv parity with dotenv-expand', () => {
  const cases: ParityCase[] = [
    {
      name: 'self-reference with default fallback',
      parsed: { A: '${A:-x}' },
    },
    {
      name: 'self-reference without default',
      parsed: { A: '${A}' },
    },
    {
      name: 'mutual cyclic references',
      parsed: { A: '$B', B: '$A' },
    },
    {
      name: 'nested defaults',
      parsed: { A: '${MISSING:-${FALLBACK:-z}}' },
    },
    {
      name: 'empty-string semantics for plus/minus operators',
      parsed: {
        EMPTY: '',
        X: '${EMPTY:+yes}',
        Y: '${EMPTY+yes}',
        Z: '${EMPTY:-no}',
        W: '${EMPTY-no}',
      },
    },
    {
      name: 'escaped variables and mixed references',
      parsed: {
        X: 'value',
        A: '\\$X and $X',
        B: '\\${X}',
      },
    },
    {
      name: 'process env precedence',
      parsed: {
        A: '$B',
        B: 'local',
      },
      processEnv: {
        A: 'from-env',
        B: 'from-env-b',
      },
    },
    {
      name: 'unclosed template remains literal',
      parsed: { A: '${UNFINISHED' },
    },
  ]

  for (const tc of cases) {
    test(tc.name, () => {
      const processEnv = tc.processEnv ?? {}

      const expected = runDotenvExpand({
        parsed: tc.parsed,
        processEnv,
      })

      const actual = runCustomExpand({
        parsed: tc.parsed,
        processEnv,
      })

      assert.deepEqual(actual.parsed, expected.parsed)
      assert.deepEqual(actual.processEnv, expected.processEnv)
    })
  }
})
