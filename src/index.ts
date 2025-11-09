import EnvironmentsAPI from './api/environments/api'
import { ProjectsAPI } from './api/workspace/projects/api'
import { SecretsAPI } from './api/workspace/secrets/api'
import { createHttpClient, HttpClient } from './http/client'
import verifyWebhook from './webhooks/verify'
import { WebhooksAPI as WsWebhooksAPI } from './api/workspace/webhooks/api'
import { EnvironmentsAPI as WsEnvironmentsAPI } from './api/workspace/environments/api'
import { getCurrentAuthDetails } from './api/shared/handlers/whoami'

/**
 * Creates an SDK object that encapsulates functionality for managing projects, environments, and secrets.
 *
 * @param apiKey - Service or Personal API key.
 * @returns An object containing methods for interacting with projects, environments, and secrets.
 */
export function createWorkspaceClient(apiKey: string) {
  const client = createHttpClient({
    authorization: { apiKey },
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
  public readonly projects: ProjectsAPI

  /**
   * Provides access to the Environments API for a specific project.
   *
   * @param args - An object with a `project` property.
   * @param args.project - The project's name or ID.
   */
  public environments(args: { project: string }) {
    return new WsEnvironmentsAPI(this.client, args.project)
  }

  /** API for interacting with secrets. */
  /**
   * Provides access to the Secrets API for a specific project and environment.
   *
   * @param args - An object with a `project` and `environment` property.
   * @param args.project - The project's name or ID.
   * @param args.environment - The environment's name or ID.
   */
  public secrets(args: { project: string; environment: string }) {
    return new SecretsAPI(this.client, args.project, args.environment)
  }

  /** API for interacting with webhooks. */
  /**
   * Provides access to the Webhooks API for a specific project and environment.
   *
   * @param args - An object with a `project` and `environment` property.
   * @param args.project - The project's name or ID.
   * @param args.environment - The environment's name or ID.
   */
  public webhooks(args: { project: string; environment: string }) {
    return new WsWebhooksAPI(this.client, args.project, args.environment)
  }

  /**
   * Retrieves information about the currently authenticated entity associated with the API key.
   *
   * @returns A promise that resolves to the currently authenticated entity data or an error response.
   */
  whoami = async () => {
    return await getCurrentAuthDetails(this.client)
  }
}

/**
 * Creates an API client for environment-specific operations using an environment API key.
 *
 * @param apiKey - Environment Account API key.
 * @returns An object containing methods for interacting with the environment.
 */
export function createEnvClient(apiKey: string) {
  const client = createHttpClient({
    authorization: { apiKey },
  })

  return new EnvironmentsAPI(client)
}

export { verifyWebhook }
