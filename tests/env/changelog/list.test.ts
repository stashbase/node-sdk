import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('List changes', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await stashbase.changelog.list(true, {
    limit: 10,
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data?.data[0].id)

    for (const change of data?.data) {
      const res = await stashbase.changelog.get(change.id)

      if (res.error) {
        console.log(res.error)
      } else {
        console.log(res.data)
      }
    }
  }
})
