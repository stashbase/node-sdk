import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Delete all secrets', async () => {
  const envEase = createEnvEase('sbw_WfKFzQabKFGlfO3C8ZDwhY0UT1Rbt0KzRVOKizdepFsMx22gwq29hEQ2')

  const { data, error } = await envEase.environments.removeAll({
    project: 'name',
    environment: '123',
  })

  console.log(data)
  console.log(error)
})
