import environmentsAPI from './api/environments/api'
import { projectsAPI } from './api/workspace/projects/api'
import { environmentsAPI as envApi } from './api/workspace/environments/api'
import { secretsAPI } from './api/workspace/secrets/api'
import { createHttpClient } from './http/client'
import verifyWebhook from './webhooks/verify'

/**
 * Creates an SDK object that encapsulates functionality for managing projects, environments, and secrets.
 *
 * @param workspaceApiKey - The Worksapce API key.
 * @returns An object containing methods for interacting with projects, environments, and secrets.
 */
export function createEnvEase(workspaceApiKey: string) {
  const client = createHttpClient({
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

/**
 * Creates an API client for environment-specific operations using an environment API key.
 *
 * @param envApiKey - The environment API key.
 * @returns An object containing methods for interacting with the environment.
 */
export function createEnvApi(envApiKey: string) {
  console.log(envApiKey)
  const client = createHttpClient({
    authorization: { envApiKey },
  })

  return environmentsAPI(client)
}

export { verifyWebhook }
