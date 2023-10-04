import environmentsAPI from './api/environments/api'
import { projectsAPI } from './api/workspace/projects/api'
import { environmentsAPI as envApi } from './api/workspace/environments/api'
import { secretsAPI } from './api/workspace/secrets/api'

import { createHttpClient } from './http/client'

// Create an SDK object that encapsulates functionality
// ROOT
export function createEnvEase(workspaceToken: string) {
  const client = createHttpClient({ basePath: '', authorization: { workspaceToken } })

  const projects = projectsAPI(client)
  const environments = envApi(client)
  const secrets = secretsAPI(client)

  return {
    projects,
    environments,
    secrets,
  }
}

// only for env with env token
export function createEnvApi(envToken: string) {
  console.log(envToken)
  const client = createHttpClient({ basePath: 'environments', authorization: { envToken } })

  return environmentsAPI(client)
}
