import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Revert change', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await stashbase.changelog.revert('chng_6pfHNDhXLNMZkgpmhA61cY')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
