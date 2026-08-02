import { assert, describe, test } from 'vitest'
import {
  SECRET_VALUE_MAX_BYTES,
  isResourceIdFormat,
  validateSetSecretsInput,
  validateUpdateSecretsInput,
} from '../../../src/utils/inputValidation'

describe('resource ID validation', () => {
  test('requires every character in an ID suffix to be alphanumeric', () => {
    assert.isTrue(isResourceIdFormat('webhook', `whk_${'a'.repeat(22)}`))
    assert.isFalse(isResourceIdFormat('webhook', `whk_${'!'.repeat(21)}a`))
    assert.isFalse(isResourceIdFormat('project', `proj_${'a'.repeat(21)}`))
  })
})

describe('secret value validation', () => {
  test('accepts a secret value exactly at the 16 KB UTF-8 byte limit', () => {
    const response = validateSetSecretsInput([
      { name: 'API_KEY', value: 'a'.repeat(SECRET_VALUE_MAX_BYTES) },
    ])

    assert.equal(response, null)
  })

  test('rejects a secret value one byte over the 16 KB UTF-8 byte limit', () => {
    const response = validateSetSecretsInput([
      { name: 'API_KEY', value: 'a'.repeat(SECRET_VALUE_MAX_BYTES + 1) },
    ])

    assert.equal(response?.code, 'validation.secret_values_too_long')
    assert.equal(
      response?.message,
      'One or more secret values are too long. Secret value must not exceed 16 KB.'
    )
    assert.deepEqual(response?.details, { secretNames: ['API_KEY'] })
  })

  test('measures multibyte secret values by UTF-8 bytes instead of character count', () => {
    const rocket = '🚀'
    const fitsWithinLimit = rocket.repeat(Math.floor(SECRET_VALUE_MAX_BYTES / Buffer.byteLength(rocket, 'utf8')))
    const exceedsLimit = fitsWithinLimit + rocket

    assert.isTrue(fitsWithinLimit.length < SECRET_VALUE_MAX_BYTES)
    assert.equal(Buffer.byteLength(fitsWithinLimit, 'utf8'), SECRET_VALUE_MAX_BYTES)
    assert.equal(Buffer.byteLength(exceedsLimit, 'utf8'), SECRET_VALUE_MAX_BYTES + 4)

    assert.equal(validateUpdateSecretsInput([{ name: 'API_KEY', value: fitsWithinLimit }]), null)

    const response = validateUpdateSecretsInput([{ name: 'API_KEY', value: exceedsLimit }])

    assert.equal(response?.code, 'validation.secret_values_too_long')
    assert.deepEqual(response?.details, { secretNames: ['API_KEY'] })
  })
})
