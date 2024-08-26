import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('List secrets excluding', () => {
  test('OK', async () => {
    const envEase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.secrets.listExcluding({
      project: 'name',
      environment: '123',
      exclude: ['DB_HOST', 'DB_PORT'],
    })

    console.log(data)
    console.log(error)
  })
})
