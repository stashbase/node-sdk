import { test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Delete secrets', async () => {
  const envEase = createEnvEase(process.env.WORKSPACE_API_KEY as string)

  const { data, error } = await envEase.secrets.removeAll({
    project: 'name',
    environment: '123',
  })
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
