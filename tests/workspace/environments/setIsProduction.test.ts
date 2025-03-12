import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Mark environment as production', () => {
  test('Should mark environment as production', async () => {
    const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
    const { data, error } = await stashbase.environments('test').setIsProduction('api-prod', true)

    console.log(data)
    console.log(error)
  })
})
