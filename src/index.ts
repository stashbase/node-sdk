import EnvironmentsAPI from './api/environments/api'
import { ProjectsAPI } from './api/workspace/projects/api'
import { SecretsAPI } from './api/workspace/secrets/api'
import { createHttpClient } from './http/client'
import verifyWebhook from './webhooks/verify'
import { WebhooksAPI as WsWebhooksAPI } from './api/workspace/webhooks/api'
import { EnvironmentsAPI as WsEnvironmentsAPI } from './api/workspace/environments/api'

/**
 * Creates an SDK object that encapsulates functionality for managing projects, environments, and secrets.
 *
 * @param workspaceApiKey - The Worksapce API key.
 * @returns An object containing methods for interacting with projects, environments, and secrets.
 */
export function createWorkspaceClient(workspaceApiKey: string) {
  const client = createHttpClient({
    authorization: { workspaceApiKey },
  })

  const projects = new ProjectsAPI(client)
  const environments = new WsEnvironmentsAPI(client)

  return {
    projects,
    environments,
    secrets: (projectNameOrId: string, envNameOrId: string) => {
      return new SecretsAPI(client, projectNameOrId, envNameOrId)
    },
    webhooks: (projectId: string, environmentId: string) => {
      return new WsWebhooksAPI(client, projectId, environmentId)
    },
  }
}

/**
 * Creates an API client for environment-specific operations using an environment API key.
 *
 * @param envApiKey - The environment API key.
 * @returns An object containing methods for interacting with the environment.
 */
export function createEnvClient(envApiKey: string) {
  console.log(envApiKey)
  const client = createHttpClient({
    authorization: { envApiKey },
  })

  return new EnvironmentsAPI(client)
}

export { verifyWebhook }
