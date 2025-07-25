import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Create environment', () => {
  test('', async () => {
    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.environments('proj_nVpZPsL5nQTUP9yXU2GKYJ').create({
      name: 'app-dev',
      isProduction: false,
    })

    console.log(data)

    if (error?.isConflictError()) {
      const code = error.code === 'conflict.environment_already_exists'
      console.log('Is conflictError')
    }
  })
})
