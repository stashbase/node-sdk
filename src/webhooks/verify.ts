import crypto from 'crypto'
import { Event, VerifyWebhookPayload, WebhookVerificationResult } from './types'

const createSignature = (data: string, timestamp: number, secret: string): string => {
  const signature = crypto.createHmac('sha256', secret).update(`${timestamp}.${data}`).digest('hex')

  return `${timestamp}.${signature}`
}

const verifyPayloadAndTimestamp = (args: {
  receivedPayload: string
  receivedSignature: string
  secret: string
  timestampWindow: number
}): null | {
  error: 'invalid_signature' | 'timestamp_too_old'
} => {
  const { receivedPayload, receivedSignature, secret, timestampWindow } = args

  if (!receivedSignature || typeof receivedSignature !== 'string') {
    return { error: 'invalid_signature' }
  }

  const [timestampStr] = receivedSignature.split('.')
  if (!timestampStr) {
    return { error: 'invalid_signature' }
  }

  const timestamp = parseInt(timestampStr, 10)
  if (!Number.isFinite(timestamp)) {
    return { error: 'invalid_signature' }
  }

  const currentTimestamp = Math.floor(Date.now() / 1000)

  // Verify timestamp within an acceptable time window
  const isTimestampValid = Math.abs(currentTimestamp - timestamp) <= timestampWindow

  if (!isTimestampValid) {
    return { error: 'timestamp_too_old' } // Timestamp verification failed
  }

  // Recreate expected signature using the extracted timestamp and received payload
  const expectedSignature = createSignature(receivedPayload, timestamp, secret)

  if (expectedSignature?.length !== receivedSignature?.length) {
    return { error: 'invalid_signature' }
  }

  const signatureValidation = crypto.timingSafeEqual(
    toSharedBuffer(expectedSignature),
    toSharedBuffer(receivedSignature)
  )

  if (!signatureValidation) {
    return { error: 'invalid_signature' }
  }

  return null
}

/**
 * @summary Verify webhook
 * @description Verify received webhook
 * @param payload Received JSON payload
 * @param signature Received signature (header 'stashbase-signature')
 * @param signingSecret Signing secret of the webhook
 * @returns WebhookVerificationResult object
 * */
const verifyWebhook = (
  payload: VerifyWebhookPayload,
  signature: string,
  signingSecret: string
): WebhookVerificationResult => {
  // Defaults to 5 minutes
  const timestampWindow = 300

  try {
    const rawPayload = normalizePayload(payload)
    if (!rawPayload) {
      return { error: 'invalid_payload', success: false, event: null }
    }

    const isVerified = verifyPayloadAndTimestamp({
      receivedPayload: rawPayload,
      receivedSignature: signature,
      secret: signingSecret,
      timestampWindow,
    })

    if (isVerified?.error) {
      return { error: isVerified.error, success: false, event: null }
    }

    if (typeof payload === 'object' && !(payload instanceof Uint8Array) && !Buffer.isBuffer(payload)) {
      return { error: null, success: true, event: payload as Event }
    }

    const event = JSON.parse(rawPayload) as Event
    return { error: null, success: true, event }
  } catch (e) {
    return { error: 'invalid_payload', success: false, event: null }
  }
}

export default verifyWebhook

// Compare signatures using timing-safe equality check
// Use SharedArrayBuffer to ensure ArrayBuffer compatibility
const toSharedBuffer = (str: string): Uint8Array => {
  const encoder = new TextEncoder()
  const arr = encoder.encode(str)

  const sharedBuffer = new SharedArrayBuffer(arr.length)
  const sharedArr = new Uint8Array(sharedBuffer)

  sharedArr.set(arr)
  return sharedArr
}

const normalizePayload = (payload: VerifyWebhookPayload): string | null => {
  if (typeof payload === 'string') {
    return payload
  }

  if (Buffer.isBuffer(payload)) {
    return payload.toString('utf8')
  }

  if (payload instanceof Uint8Array) {
    return Buffer.from(payload).toString('utf8')
  }

  if (payload && typeof payload === 'object') {
    return JSON.stringify(payload)
  }

  return null
}
