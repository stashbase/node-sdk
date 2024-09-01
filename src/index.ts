import EnvironmentsAPI from './api/environments/api'
import { ProjectsAPI } from './api/workspace/projects/api'
import { SecretsAPI } from './api/workspace/secrets/api'
import { createHttpClient, HttpClient } from './http/client'
import verifyWebhook from './webhooks/verify'
import { WebhooksAPI as WsWebhooksAPI } from './api/workspace/webhooks/api'
import { ChangelogAPI as WsChangelogAPI } from './api/workspace/changelog/api'
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

  return new WorkspaceClient(client)
}

/** Client for interacting with Stashbase resources using a workspace API key with a given permissions. */
class WorkspaceClient {
  private client: HttpClient

  constructor(client: HttpClient) {
    this.client = client
    this.projects = new ProjectsAPI(client)
  }

  /** API for interacting with projects. */
  public projects: ProjectsAPI

  /** API for interacting with environments. */
  public environments(projectNameOrId: string) {
    return new WsEnvironmentsAPI(this.client, projectNameOrId)
  }

  /** API for interacting with secrets. */
  public secrets(projectNameOrId: string, envNameOrId: string) {
    return new SecretsAPI(this.client, projectNameOrId, envNameOrId)
  }

  /** API for interacting with secrets changelog (change history). */
  public changelog(projectNameOrId: string, envNameOrId: string) {
    return new WsChangelogAPI(this.client, projectNameOrId, envNameOrId)
  }

  /** API for interacting with webhooks. */
  public webhooks(projectNameOrId: string, envNameOrId: string) {
    return new WsWebhooksAPI(this.client, projectNameOrId, envNameOrId)
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
