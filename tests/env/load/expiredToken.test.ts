import { assert, test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Returns exipred token error', async () => {
  const client = createEnvironmentClient('5D0sqWbu8BzauYK76bFQ4hrIstkQKeqr')

  const { error } = await client.environment.load({
    printSecrets: 'name',
  })

  if (error) {
    const { code } = error
  }
})
