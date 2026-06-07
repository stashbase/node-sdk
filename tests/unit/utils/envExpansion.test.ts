import { assert, describe, test } from 'vitest'
import { expandAndInjectEnv } from '../../../src/utils/envExpansion'

describe('expandAndInjectEnv', () => {
  test('expands references from parsed values', () => {
    const processEnv: Record<string, string | undefined> = {}
    const parsed = {
      BASE_URL: 'https://api.example.com',
      HEALTH_URL: '${BASE_URL}/health',
    }

    expandAndInjectEnv(parsed, processEnv)

    assert.equal(parsed.HEALTH_URL, 'https://api.example.com/health')
    assert.equal(processEnv.HEALTH_URL, 'https://api.example.com/health')
  })

  test('prefers process env existing value for same key', () => {
    const processEnv: Record<string, string | undefined> = {
      API_KEY: 'from-process-env',
    }
    const parsed = {
      API_KEY: 'from-parsed',
    }

    expandAndInjectEnv(parsed, processEnv)

    assert.equal(parsed.API_KEY, 'from-process-env')
    assert.equal(processEnv.API_KEY, 'from-process-env')
  })

  test('supports default operator syntax', () => {
    const processEnv: Record<string, string | undefined> = {}
    const parsed = {
      EXISTS: 'set',
      FALLBACK: '${MISSING:-default-value}',
      ALT: '${EXISTS:+yes}',
      ALT_EMPTY: '${MISSING:+yes}',
      ALT_SHORT: '${EXISTS+ok}',
      ALT_SHORT_EMPTY: '${MISSING+ok}',
    }

    expandAndInjectEnv(parsed, processEnv)

    assert.equal(parsed.FALLBACK, 'default-value')
    assert.equal(parsed.ALT, 'yes')
    assert.equal(parsed.ALT_EMPTY, '')
    assert.equal(parsed.ALT_SHORT, 'ok')
    assert.equal(parsed.ALT_SHORT_EMPTY, '')
  })

  test('distinguishes empty strings from unset values', () => {
    const processEnv: Record<string, string | undefined> = {
      EMPTY: '',
    }
    const parsed = {
      DEFAULT_IF_UNSET_ONLY: '${EMPTY-fallback}',
      DEFAULT_IF_EMPTY: '${EMPTY:-fallback}',
      ALT_IF_SET: '${EMPTY+present}',
      ALT_IF_NON_EMPTY: '${EMPTY:+present}',
      DIRECT: '$EMPTY',
    }

    expandAndInjectEnv(parsed, processEnv)

    assert.equal(parsed.DEFAULT_IF_UNSET_ONLY, '')
    assert.equal(parsed.DEFAULT_IF_EMPTY, 'fallback')
    assert.equal(parsed.ALT_IF_SET, 'present')
    assert.equal(parsed.ALT_IF_NON_EMPTY, '')
    assert.equal(parsed.DIRECT, '')
  })

  test('prefers empty process env values over parsed values for the same key', () => {
    const processEnv: Record<string, string | undefined> = {
      API_KEY: '',
    }
    const parsed = {
      API_KEY: 'from-parsed',
    }

    expandAndInjectEnv(parsed, processEnv)

    assert.equal(parsed.API_KEY, '')
    assert.equal(processEnv.API_KEY, '')
  })

  test('resolves escaped variables literally', () => {
    const processEnv: Record<string, string | undefined> = {
      TOKEN: 'secret',
    }
    const parsed = {
      LITERAL: '\\$TOKEN',
    }

    expandAndInjectEnv(parsed, processEnv)

    assert.equal(parsed.LITERAL, '$TOKEN')
    assert.equal(processEnv.LITERAL, '$TOKEN')
  })
})
