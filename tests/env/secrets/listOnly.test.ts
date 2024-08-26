import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('List environment secrets', async () => {
  const envApi = createEnvApi(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await envApi.secrets.listOnly(['PORT', 'NODE_ENV'], {
    expandRefs: true,
    omit: ['description'],
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
