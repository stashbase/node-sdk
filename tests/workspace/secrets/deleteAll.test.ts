import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Delete secrets', async () => {
  const client = createWorkspaceClient(
    'sbs_ElRbXgfhk0Y55sSrQkjHwsBOpRaK7DdsfFBVpqxW8a8KxAbMbEvmLHFY'
  )

  const { data, error } = await client.secrets({ project: 'name', environment: '123' }).deleteAll()

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
