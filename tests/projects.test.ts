// tests/projects.test.ts
import { test } from 'vitest'
import EnvEaseSDK from '../src'

test('List environments in projects', async () => {
  const sdk = new EnvEaseSDK('YOUR_ACCESS_TOKEN')

  const projects = await sdk.projects.environments({ project: 'YOUR_PROJECT_NAME' }).list()

  console.log(projects)

  // Write your assertions here to test the results
  // For example:
  // assert.equal(projects.length, expectedProjectCount);
  // assert.include(projects[0].name, 'Expected Project Name');
})
