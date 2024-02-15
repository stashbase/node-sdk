import crypto from 'crypto'
import { Event, WebhookVerificationResult } from './types'

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

  const [timestampStr, _] = receivedSignature?.split('.')
  const timestamp = parseInt(timestampStr, 10)
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

  // Compare signatures using timing-safe equality check
  const signatureValidation = crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(receivedSignature)
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
  payload: unknown,
  signature: string,
  signingSecret: string
): WebhookVerificationResult => {
  // Defaults to 5 minutes
  const timestampWindow = 300

  try {
    const jsonBodyString = JSON.stringify(payload)

    const isVerified = verifyPayloadAndTimestamp({
      receivedPayload: jsonBodyString,
      receivedSignature: signature,
      secret: signingSecret,
      timestampWindow,
    })

    if (isVerified?.error) {
      return { error: isVerified.error, success: false, event: null }
    }

    return { error: null, success: true, event: payload as Event }
  } catch (e) {
    return { error: 'invalid_payload', success: false, event: null }
  }
}

export default verifyWebhook
