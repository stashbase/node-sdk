import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Get change', async () => {
  const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await stashbase
    .changelog('test', 'api-dev')
    .get('echg_tUQ1mCim2wtH5gdsMT2iWo')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
