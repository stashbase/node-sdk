import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'

test('Update secrets', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .secrets({
      project: 'name',
      environment: '123',
    })
    .update([
      {
        name: 'KEYS',
        comment: null,
      },
    ])

  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)

    if (error.code === 'validation.no_data_provided') {
      console.log(error.details)
    }
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
