import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Get secret', () => {
  test('OK', async () => {
    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.secrets('hero-hub', 'vercel').get('SOME_KEY')

    console.log(data)
    console.log(error)
  })
})
