import { createApiClient } from './api/client'
import projectsAPI from './api/projects'

// Create an SDK object that encapsulates functionality
export function createEnvEase(accessToken: string) {
  const client = createApiClient(accessToken)

  const projects = projectsAPI(client)

  return {
    projects,
  }
}
