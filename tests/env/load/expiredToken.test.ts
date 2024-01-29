import { assert, test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Returns exipred token error', async () => {
  const envApi = createEnvApi('5D0sqWbu8BzauYK76bFQ4hrIstkQKeqr')

  const { error } = await envApi.load({
    print: 'key',
  })

  if (error) {
    const { code } = error
  }
})
