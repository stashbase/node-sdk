import environmentsAPI from './api/environments/api'
import { projectsAPI } from './api/workspace/projects/api'
import { environmentsAPI as envApi } from './api/workspace/environments/api'
import { secretsAPI } from './api/workspace/secrets/api'
import { createHttpClient } from './http/client'
import verifyWebhook from './webhooks/verify'

// Create an SDK object that encapsulates functionality
// ROOT
export function createEnvEase(workspaceApiKey: string) {
  const client = createHttpClient({
    basePath: '',
    authorization: { workspaceApiKey },
  })

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
export function createEnvApi(envApiKey: string) {
  console.log(envApiKey)
  const client = createHttpClient({
    basePath: 'environments',
    authorization: { envApiKey },
  })

  return environmentsAPI(client)
}

export { verifyWebhook }
