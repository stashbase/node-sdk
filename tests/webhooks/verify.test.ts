import { assert, describe, test } from 'vitest'
import crypto from 'crypto'
import { verifyWebhook } from '../../src'

const createSignature = (rawPayload: string, timestamp: number, secret: string) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawPayload}`)
    .digest('hex')
  return `${timestamp}.${hash}`
}

describe('verifyWebhook', () => {
  const secret = 'whsec_test_secret'

  test('verifies a raw JSON string payload', () => {
    const payload =
      '{"id":"evt_1","type":"secrets.updated","created_at":1710000000,"live_mode":false,"data":{"workspace":{"id":"w1","name":"n","slug":"s"},"project":{"id":"p1","name":"proj"},"environment":{"id":"e1","name":"dev","is_production":false}}}'
    const signature = createSignature(payload, Math.floor(Date.now() / 1000), secret)

    const result = verifyWebhook(payload, signature, secret)

    assert.equal(result.success, true)
    if (result.success) {
      assert.equal(result.event.id, 'evt_1')
    }
  })

  test('verifies a Buffer payload', () => {
    const payload =
      '{"id":"evt_2","type":"secrets.updated","created_at":1710000000,"live_mode":false,"data":{"workspace":{"id":"w1","name":"n","slug":"s"},"project":{"id":"p1","name":"proj"},"environment":{"id":"e1","name":"dev","is_production":false}}}'
    const signature = createSignature(payload, Math.floor(Date.now() / 1000), secret)

    const result = verifyWebhook(Buffer.from(payload, 'utf8'), signature, secret)

    assert.equal(result.success, true)
  })

  test('raw payload succeeds when parsed-object fallback fails due to byte differences', () => {
    const payloadWithWhitespace =
      '{  "id": "evt_3", "type":"secrets.updated", "created_at":1710000000, "live_mode":false, "data": {"workspace":{"id":"w1","name":"n","slug":"s"},"project":{"id":"p1","name":"proj"},"environment":{"id":"e1","name":"dev","is_production":false}} }'

    const signature = createSignature(payloadWithWhitespace, Math.floor(Date.now() / 1000), secret)

    const parsedPayload = JSON.parse(payloadWithWhitespace) as Record<string, unknown>

    const objectResult = verifyWebhook(parsedPayload, signature, secret)
    const rawResult = verifyWebhook(payloadWithWhitespace, signature, secret)

    assert.equal(objectResult.success, false)
    assert.equal(objectResult.error, 'invalid_signature')

    assert.equal(rawResult.success, true)
  })
})
