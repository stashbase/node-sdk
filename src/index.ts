import environmentsAPI from './api/environments/api'
import { createEnvApiClient } from './api/environments/client'
import { createApiClient } from './oldApi/client'
import projectsAPI from './oldApi/projects'

// Create an SDK object that encapsulates functionality
// ROOT
export function createEnvEase(accessToken: string) {
  const client = createApiClient(accessToken)

  const projects = projectsAPI(client)

  return {
    projects,
  }
}

// only for env with env token
export function createEnvApi(envToken: string) {
  console.log(envToken)
  const client = createEnvApiClient(envToken)

  return environmentsAPI(client)
}
