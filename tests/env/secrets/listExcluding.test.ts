import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('List environment secrets excluding selected', async () => {
  const envApi = createEnvApi(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await envApi.secrets.listExcluding(
    ['PORT', 'NODE_ENV', 'STRIPE_SECRET_KEY', 'LOG_LEVEL', 'DB_PASSWORD', 'DB_CLIENT'],
    {
      expandRefs: true,
    }
  )

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
