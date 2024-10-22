import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Update secrets', async () => {
  const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await envEase.secrets('name', '123').update([
    {
      name: 'KEYS',
      description: null,
    },
  ])

  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)

    if (error.isValidationError()) {
      const code = error.code === 'validation.no_data_provided'
      if (code) {
        const d = error.details

        console.log(d)
      }
    }
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
