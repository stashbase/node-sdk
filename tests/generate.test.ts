import { assert, describe, test } from 'vitest'
import {
  generate,
  getRandomTargetLength,
} from '../src'

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const UUID_V7_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('uuid generators', () => {
  test('generates valid uuid v4', () => {
    const value = generate.uuid.v4()
    assert.match(value, UUID_V4_REGEX)
  })

  test('generates valid uuid v7', () => {
    const value = generate.uuid.v7()
    assert.match(value, UUID_V7_REGEX)
  })
})

describe('random string generators', () => {
  test('hex respects explicit length', () => {
    const value = generate.random.hex({ length: 20 })
    assert.equal(value.length, 20)
    assert.match(value, /^[0-9a-f]+$/)
  })

  test('alphanumeric with bytes uses bytes as target length', () => {
    const value = generate.random.alphanumeric({ bytes: 11 })
    assert.equal(value.length, 11)
    assert.match(value, /^[a-zA-Z0-9]+$/)
  })

  test('base32 output shape and uppercase', () => {
    const value = generate.random.base32({ length: 17, uppercase: true })
    assert.equal(value.length, 17)
    assert.match(value, /^[A-Z2-7]+$/)
  })

  test('base64 removes padding and uses expected charset', () => {
    const value = generate.random.base64({ length: 23 })
    assert.equal(value.length, 23)
    assert.match(value, /^[A-Za-z0-9+/]+$/)
  })

  test('base64url removes padding and uses url-safe charset', () => {
    const value = generate.random.base64url({ length: 23 })
    assert.equal(value.length, 23)
    assert.match(value, /^[A-Za-z0-9_-]+$/)
  })

  test('base64Url alias works', () => {
    const value = generate.random.base64Url({ bytes: 12 })
    assert.equal(value.length, 16)
    assert.match(value, /^[A-Za-z0-9_-]+$/)
  })

  test('bytes override length', () => {
    const value = generate.random.hex({ length: 64, bytes: 9 })
    assert.equal(value.length, 18)
  })

  test('throws on invalid range', () => {
    assert.throws(
      () => generate.random.hex({ length: 2 }),
      /length must be an integer between 3 and 256/
    )
    assert.throws(
      () => generate.random.hex({ bytes: 257 }),
      /bytes must be an integer between 3 and 256/
    )
  })
})

describe('target length calculation', () => {
  test('matches rust command behavior', () => {
    assert.equal(getRandomTargetLength('hex', { bytes: 10 }), 20)
    assert.equal(getRandomTargetLength('alphanumeric', { bytes: 10 }), 10)
    assert.equal(getRandomTargetLength('base32', { bytes: 10 }), 16)
    assert.equal(getRandomTargetLength('base64', { bytes: 10 }), 14)
    assert.equal(getRandomTargetLength('base64url', { bytes: 10 }), 14)
  })
})
