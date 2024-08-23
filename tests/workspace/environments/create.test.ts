import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Create environment', () => {
  test('', async () => {
    const envEase = createEnvEase('sbc_jeY61Qt6lqHrS3KRvXjSYr5GkZlMaVOGocmNorUdjqBIrlnmFFjzkIcU')

    const { data, error } = await envEase.environments.create({
      project: 'pr_nVpZPsL5nQTUP9yXU2GKYJ',
      name: 'ev_3NCdY7kmbLJpZcpMg4W6wk-dev',
      type: 'DEVELOPMENT',
    })

    if (error?.isConflictError()) {
      const code = error.code === 'conflict.environment_already_exists'
      console.log('Is isValidationError')
    }
  })
})
