import { createApiClient } from './oldApi/client'
import environmentsAPI from './oldApi/environments/api'
import projectsAPI from './oldApi/projects'

// Create an SDK object that encapsulates functionality
export function createEnvEase(accessToken: string) {
  const client = createApiClient(accessToken)

  const projects = projectsAPI(client)

  return {
    projects,
  }
}
