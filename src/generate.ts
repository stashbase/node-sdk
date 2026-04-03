import { createHash, generateKeyPairSync, randomBytes, randomInt, randomUUID } from 'node:crypto'

export const RANDOM_STRING_MIN_LENGTH = 3
export const RANDOM_STRING_MAX_LENGTH = 256

export type RandomEncoding = 'alphanumeric' | 'hex' | 'base32' | 'base64' | 'base64url'

export type GenerateRandomStringOptions = {
  /**
   * Length of the generated random string.
   * Ignored when `bytes` is provided.
   */
  length?: number

  /**
   * Entropy length in bytes. Overrides `length`.
   */
  bytes?: number

  /**
   * Convert final output to uppercase.
   */
  uppercase?: boolean
}

export type GenerateHashAlgorithm = 'sha224' | 'sha256' | 'sha384' | 'sha512'

export type GenerateHashOptions = {
  /**
   * Hash algorithm.
   * @default 'sha256'
   */
  algorithm?: GenerateHashAlgorithm

  /**
   * Convert final hash output to uppercase.
   */
  uppercase?: boolean
}

export const PASSPHRASE_MIN_WORDS = 3
export const PASSPHRASE_MAX_WORDS = 24

export type GeneratePassphraseOptions = {
  /**
   * Number of words in passphrase.
   * @default 6
   */
  words?: number

  /**
   * Separator between words.
   * @default '-'
   */
  separator?: string

  /**
   * Convert final output to uppercase.
   */
  uppercase?: boolean
}

export type GenerateSshKeyType = 'ed25519' | 'rsa'

export type GenerateSshKeypairOptions = {
  /**
   * SSH key algorithm.
   * @default 'ed25519'
   */
  keyType?: GenerateSshKeyType

  /**
   * Key comment appended to public key.
   * @default 'stashbase@local'
   */
  comment?: string

  /**
   * Passphrase for private key.
   */
  passphrase?: string
}

export type GenerateSshKeypairResult = {
  keyType: GenerateSshKeyType
  privateKey: string
  publicKey: string
  fingerprint: string
}

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const ALPHANUMERIC_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const PASSPHRASE_WORDS = [
  'anchor', 'apple', 'arch', 'arrow', 'atom', 'badge', 'bamboo', 'beacon', 'berry', 'bicycle',
  'bird', 'bloom', 'boat', 'breeze', 'brook', 'cable', 'cactus', 'candle', 'canyon', 'captain',
  'castle', 'cedar', 'chalk', 'cherry', 'circle', 'cloud', 'clover', 'coast', 'comet', 'coral',
  'cotton', 'crystal', 'delta', 'dolphin', 'drift', 'dune', 'eagle', 'ember', 'falcon', 'field',
  'finch', 'flame', 'flower', 'forest', 'fossil', 'frost', 'galaxy', 'garden', 'glacier', 'globe',
  'granite', 'harbor', 'harvest', 'hazel', 'horizon', 'island', 'jasmine', 'jewel', 'jungle',
  'kernel', 'lagoon', 'lantern', 'leaf', 'legend', 'lemon', 'lilac', 'lotus', 'lunar', 'maple',
  'marble', 'meadow', 'meteor', 'mint', 'mirror', 'mist', 'mountain', 'nebula', 'nectar', 'night',
  'north', 'oasis', 'ocean', 'olive', 'onyx', 'orbit', 'orchid', 'palm', 'pearl', 'pebble',
  'pepper', 'phoenix', 'pine', 'planet', 'plume', 'prairie', 'prism', 'quartz', 'raven', 'reef',
  'river', 'rocket', 'saddle', 'saffron', 'sapphire', 'scarlet', 'shadow', 'silver', 'sky', 'solar',
  'sparrow', 'spring', 'stone', 'sunset', 'swift', 'thunder', 'timber', 'topaz', 'trail', 'valley',
  'velvet', 'violet', 'wave', 'willow', 'winter', 'zephyr', 'zinc',
] as const

function isValidLength(length: number) {
  return (
    Number.isInteger(length) &&
    length >= RANDOM_STRING_MIN_LENGTH &&
    length <= RANDOM_STRING_MAX_LENGTH
  )
}

function validateRandomOptions(options: GenerateRandomStringOptions): void {
  if (options.length !== undefined && !isValidLength(options.length)) {
    throw new RangeError(
      `length must be an integer between ${RANDOM_STRING_MIN_LENGTH} and ${RANDOM_STRING_MAX_LENGTH}`
    )
  }

  if (options.bytes !== undefined && !isValidLength(options.bytes)) {
    throw new RangeError(
      `bytes must be an integer between ${RANDOM_STRING_MIN_LENGTH} and ${RANDOM_STRING_MAX_LENGTH}`
    )
  }
}

function validatePassphraseOptions(options: GeneratePassphraseOptions): void {
  if (
    options.words !== undefined &&
    (!Number.isInteger(options.words) ||
      options.words < PASSPHRASE_MIN_WORDS ||
      options.words > PASSPHRASE_MAX_WORDS)
  ) {
    throw new RangeError(
      `words must be an integer between ${PASSPHRASE_MIN_WORDS} and ${PASSPHRASE_MAX_WORDS}`
    )
  }
}

export function getRandomTargetLength(
  encoding: RandomEncoding,
  options: GenerateRandomStringOptions = {}
): number {
  validateRandomOptions(options)

  if (options.bytes !== undefined) {
    switch (encoding) {
      case 'hex':
        return options.bytes * 2
      case 'alphanumeric':
        return options.bytes
      case 'base32':
        return Math.ceil((options.bytes * 8) / 5)
      case 'base64':
      case 'base64url':
        return Math.ceil((options.bytes * 4) / 3)
    }
  }

  return options.length ?? 32
}

function applyUppercase(value: string, uppercase?: boolean): string {
  return uppercase ? value.toUpperCase() : value
}

function toUuidString(bytes: Uint8Array): string {
  const hex = Buffer.from(bytes).toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

/** Generate UUID v4. */
export function generateUuidV4(): string {
  return randomUUID()
}

/** Generate UUID v7 using current Unix epoch milliseconds and random bits. */
export function generateUuidV7(): string {
  const timestampMs = Date.now()
  const bytes = randomBytes(16)

  bytes[0] = Math.floor(timestampMs / 1099511627776) & 0xff // 2^40
  bytes[1] = Math.floor(timestampMs / 4294967296) & 0xff // 2^32
  bytes[2] = Math.floor(timestampMs / 16777216) & 0xff // 2^24
  bytes[3] = Math.floor(timestampMs / 65536) & 0xff // 2^16
  bytes[4] = Math.floor(timestampMs / 256) & 0xff // 2^8
  bytes[5] = timestampMs & 0xff

  // Set version to 7.
  bytes[6] = (bytes[6] & 0x0f) | 0x70

  // Set RFC 4122 variant (10xx xxxx).
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  return toUuidString(bytes)
}

function encodeBase32(data: Uint8Array): string {
  let bits = 0
  let value = 0
  let output = ''

  for (const byte of data) {
    value = (value << 8) | byte
    bits += 8

    while (bits >= 5) {
      const index = (value >>> (bits - 5)) & 31
      output += BASE32_ALPHABET[index]
      bits -= 5
    }
  }

  if (bits > 0) {
    const index = (value << (5 - bits)) & 31
    output += BASE32_ALPHABET[index]
  }

  return output
}

function randomAlphanumeric(length: number): string {
  let output = ''

  // 62 symbols, rejection sampling avoids modulo bias.
  const maxUnbiasedByte = 256 - (256 % ALPHANUMERIC_ALPHABET.length)

  while (output.length < length) {
    const batch = randomBytes(Math.max(16, length - output.length))

    for (const byte of batch) {
      if (byte >= maxUnbiasedByte) {
        continue
      }

      output += ALPHANUMERIC_ALPHABET[byte % ALPHANUMERIC_ALPHABET.length]
      if (output.length === length) {
        break
      }
    }
  }

  return output
}

function getBytesToGenerate(encoding: RandomEncoding, targetLength: number): number {
  switch (encoding) {
    case 'alphanumeric':
      return targetLength
    case 'hex':
      return Math.ceil(targetLength / 2)
    case 'base32':
      return Math.ceil((targetLength * 5) / 8)
    case 'base64':
    case 'base64url':
      return Math.ceil((targetLength * 3) / 4)
  }
}

function generateRandom(
  encoding: RandomEncoding,
  options: GenerateRandomStringOptions = {}
): string {
  const targetLength = getRandomTargetLength(encoding, options)
  const bytesCount = options.bytes ?? getBytesToGenerate(encoding, targetLength)

  let value: string

  switch (encoding) {
    case 'alphanumeric':
      value = randomAlphanumeric(targetLength)
      break
    case 'hex':
      value = randomBytes(bytesCount).toString('hex').slice(0, targetLength)
      break
    case 'base32':
      value = encodeBase32(randomBytes(bytesCount)).slice(0, targetLength)
      break
    case 'base64':
      value = randomBytes(bytesCount).toString('base64').replace(/=+$/g, '').slice(0, targetLength)
      break
    case 'base64url':
      value = randomBytes(bytesCount).toString('base64url').slice(0, targetLength)
      break
  }

  return applyUppercase(value, options.uppercase)
}

/** Generate random alphanumeric string. */
export function generateRandomAlphanumeric(options: GenerateRandomStringOptions = {}): string {
  return generateRandom('alphanumeric', options)
}

/** Generate random hexadecimal string. */
export function generateRandomHex(options: GenerateRandomStringOptions = {}): string {
  return generateRandom('hex', options)
}

/** Generate random base32 string (RFC4648, without padding). */
export function generateRandomBase32(options: GenerateRandomStringOptions = {}): string {
  return generateRandom('base32', options)
}

/** Generate random base64 string (without padding). */
export function generateRandomBase64(options: GenerateRandomStringOptions = {}): string {
  return generateRandom('base64', options)
}

/** Generate random base64url string (without padding). */
export function generateRandomBase64Url(options: GenerateRandomStringOptions = {}): string {
  return generateRandom('base64url', options)
}

/** Generate hash for value using selected algorithm. */
export function generateHash(value: string, options: GenerateHashOptions = {}): string {
  const algorithm = options.algorithm ?? 'sha256'
  const digest = createHash(algorithm).update(value).digest('hex')
  return applyUppercase(digest, options.uppercase)
}

/** Generate random passphrase from built-in word list. */
export function generatePassphrase(options: GeneratePassphraseOptions = {}): string {
  validatePassphraseOptions(options)

  const words = options.words ?? 6
  const separator = options.separator ?? '-'
  const selectedWords: string[] = []

  for (let i = 0; i < words; i++) {
    selectedWords.push(PASSPHRASE_WORDS[randomInt(PASSPHRASE_WORDS.length)])
  }

  return applyUppercase(selectedWords.join(separator), options.uppercase)
}

function base64UrlToBuffer(value: string): Buffer {
  return Buffer.from(value, 'base64url')
}

function writeSshString(value: Buffer | string): Buffer {
  const data = typeof value === 'string' ? Buffer.from(value, 'utf8') : value
  const prefix = Buffer.alloc(4)
  prefix.writeUInt32BE(data.length, 0)
  return Buffer.concat([prefix, data])
}

function writeSshMpint(value: Buffer): Buffer {
  let data = value

  while (data.length > 0 && data[0] === 0) {
    data = data.subarray(1)
  }

  if (data.length === 0) {
    return writeSshString(Buffer.alloc(0))
  }

  if ((data[0] & 0x80) !== 0) {
    data = Buffer.concat([Buffer.from([0x00]), data])
  }

  return writeSshString(data)
}

function toOpenSshPublicKey(keyType: GenerateSshKeyType, comment: string, jwk: JsonWebKey): string {
  if (keyType === 'ed25519') {
    if (jwk.kty !== 'OKP' || jwk.crv !== 'Ed25519' || !jwk.x) {
      throw new Error('failed to export ed25519 public key')
    }

    const payload = Buffer.concat([
      writeSshString('ssh-ed25519'),
      writeSshString(base64UrlToBuffer(jwk.x)),
    ])

    return `ssh-ed25519 ${payload.toString('base64')}${comment ? ` ${comment}` : ''}`
  }

  if (jwk.kty !== 'RSA' || !jwk.e || !jwk.n) {
    throw new Error('failed to export rsa public key')
  }

  const payload = Buffer.concat([
    writeSshString('ssh-rsa'),
    writeSshMpint(base64UrlToBuffer(jwk.e)),
    writeSshMpint(base64UrlToBuffer(jwk.n)),
  ])

  return `ssh-rsa ${payload.toString('base64')}${comment ? ` ${comment}` : ''}`
}

function fingerprintFromOpenSshPublicKey(publicKey: string): string {
  const parts = publicKey.trim().split(/\s+/)

  if (parts.length < 2) {
    throw new Error('invalid OpenSSH public key format')
  }

  const keyBlob = Buffer.from(parts[1], 'base64')
  const digest = createHash('sha256').update(keyBlob).digest('base64').replace(/=+$/g, '')

  return `SHA256:${digest}`
}

/** Generate SSH keypair and return key material with SHA256 fingerprint. */
export function generateSshKeypair(
  options: GenerateSshKeypairOptions = {}
): GenerateSshKeypairResult {
  const keyType = options.keyType ?? 'ed25519'
  const comment = options.comment ?? 'stashbase@local'

  const pair =
    keyType === 'rsa'
      ? generateKeyPairSync('rsa', { modulusLength: 4096 })
      : generateKeyPairSync('ed25519')

  const privateKey = pair.privateKey.export(
    options.passphrase
      ? {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: options.passphrase,
        }
      : {
          type: 'pkcs8',
          format: 'pem',
        }
  )

  const jwk = pair.publicKey.export({ format: 'jwk' })
  const publicKey = toOpenSshPublicKey(keyType, comment, jwk)
  const fingerprint = fingerprintFromOpenSshPublicKey(publicKey)

  return {
    keyType,
    privateKey: privateKey.toString(),
    publicKey,
    fingerprint,
  }
}

export const generate = {
  uuid: {
    v4: generateUuidV4,
    v7: generateUuidV7,
  },
  random: {
    alphanumeric: generateRandomAlphanumeric,
    hex: generateRandomHex,
    base32: generateRandomBase32,
    base64: generateRandomBase64,
    base64url: generateRandomBase64Url,
    base64Url: generateRandomBase64Url,
  },
  hash: generateHash,
  passphrase: generatePassphrase,
  sshKeypair: generateSshKeypair,
} as const
