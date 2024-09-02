import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Get change', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await stashbase.changelog.get('chng_6pfHNDhXLNMZkgpmhA61cYs')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
