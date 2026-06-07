import { assert, describe, test } from 'vitest'
import { generate, getRandomTargetLength } from '../../src'

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

describe('hash generator', () => {
  test('uses sha256 by default', () => {
    const value = generate.hash('hello')
    assert.equal(value, '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })

  test('supports all configured algorithms', () => {
    assert.equal(
      generate.hash('hello', { algorithm: 'sha224' }),
      'ea09ae9cc6768c50fcee903ed054556e5bfc8347907f12598aa24193'
    )
    assert.equal(
      generate.hash('hello', { algorithm: 'sha256' }),
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    )
    assert.equal(
      generate.hash('hello', { algorithm: 'sha384' }),
      '59e1748777448c69de6b800d7a33bbfb9ff1b463e44354c3553bcdb9c666fa90125a3c79f90397bdf5f6a13de828684f'
    )
    assert.equal(
      generate.hash('hello', { algorithm: 'sha512' }),
      '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043'
    )
  })

  test('supports uppercase option', () => {
    const value = generate.hash('hello', { uppercase: true })
    assert.equal(value, '2CF24DBA5FB0A30E26E83B2AC5B9E29E1B161E5C1FA7425E73043362938B9824')
  })
})

describe('passphrase generator', () => {
  test('uses defaults', () => {
    const value = generate.passphrase()
    const parts = value.split('-')

    assert.equal(parts.length, 6)
    assert.match(value, /^[a-z-]+$/)
  })

  test('supports words and separator options', () => {
    const value = generate.passphrase({ words: 8, separator: '.' })
    const parts = value.split('.')

    assert.equal(parts.length, 8)
    assert.match(value, /^[a-z.]+$/)
  })

  test('supports uppercase option', () => {
    const value = generate.passphrase({ words: 4, uppercase: true })
    assert.equal(value, value.toUpperCase())
    assert.match(value, /^[A-Z-]+$/)
  })

  test('throws on invalid words range', () => {
    assert.throws(
      () => generate.passphrase({ words: 2 }),
      /words must be an integer between 3 and 24/
    )
    assert.throws(
      () => generate.passphrase({ words: 25 }),
      /words must be an integer between 3 and 24/
    )
  })
})

describe('ssh keypair generator', () => {
  test('returns ed25519 private/public key and fingerprint', () => {
    const result = generate.sshKeypair()

    assert.equal(result.keyType, 'ed25519')
    assert.match(result.privateKey, /BEGIN PRIVATE KEY/)
    assert.match(result.publicKey, /^ssh-ed25519\s+[A-Za-z0-9+/=]+(\s+stashbase@local)?$/)
    assert.match(result.fingerprint, /^SHA256:[A-Za-z0-9+/]+$/)
  })

  test('supports rsa with fixed 4096 bits', () => {
    const result = generate.sshKeypair({ keyType: 'rsa', comment: 'me@example.com' })

    assert.equal(result.keyType, 'rsa')
    assert.match(result.privateKey, /BEGIN PRIVATE KEY/)
    assert.match(result.publicKey, /^ssh-rsa\s+[A-Za-z0-9+/=]+\s+me@example\.com$/)
    assert.match(result.fingerprint, /^SHA256:[A-Za-z0-9+/]+$/)
  })

  test('supports encrypted private key with passphrase', () => {
    const result = generate.sshKeypair({
      passphrase: 'secret123',
    })

    assert.match(result.privateKey, /ENCRYPTED/)
    assert.match(result.fingerprint, /^SHA256:[A-Za-z0-9+/]+$/)
  })
})
