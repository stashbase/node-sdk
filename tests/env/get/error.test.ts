// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Test unauthorized error', async () => {
  const envApi = createEnvApi('sbe_87S3ugSpNNPn8w6GT5d8iikHtgzjI8vggIFyEpPouz2j1LefI2CQeH9e')

  const { data, error } = await envApi.get()
  if (error) {
    console.log('Got an error')
    console.log(error.code === 'unauthorized')

    assert.equal(error.code, 'unauthorized')
  } else {
    console.log(data)
  }
})
