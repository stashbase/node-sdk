import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Lock/unlock environment', () => {
  test('Lock', async () => {
    console.log('lock test')

    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
    const { data, error } = await envEase.environments('hero-hub').lock('dev-sdk')

    console.log(data)
    console.log(error)
  })

  test('Unlock', async () => {
    console.log('unlock test')

    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
    const { data, error } = await envEase.environments('hero-hub').unlock('dev-sdk')

    console.log(data)
    console.log(error)
  })
})
