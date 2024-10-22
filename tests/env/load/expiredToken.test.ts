import { assert, test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Returns exipred token error', async () => {
  const envApi = createEnvClient('5D0sqWbu8BzauYK76bFQ4hrIstkQKeqr')

  const { error } = await envApi.load({
    print: 'name',
  })

  if (error) {
    const { code } = error
  }
})
