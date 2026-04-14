import EnvironmentClient from './api/environments/api'
import { ProjectsAPI } from './api/workspace/projects/api'
import { SecretsAPI } from './api/workspace/secrets/api'
import { createHttpClient, HttpClient } from './http/client'
import verifyWebhook from './webhooks/verify'
import { WebhooksAPI as WsWebhooksAPI } from './api/workspace/webhooks/api'
import { EnvironmentsAPI as WsEnvironmentsAPI } from './api/workspace/environments/api'
import { getCurrentAuthDetails } from './api/shared/handlers/whoami'
import { SearchSecretsOptions } from './types/secrets'
export * from './generate'
export * from './types/auth'
export * from './types/environments'
export * from './types/pagination'
export * from './types/projects'
export * from './types/secrets'
export * from './types/webhooks'
export * from './types/errors/index'
export type * as EnvironmentErrors from './types/errors/environments'
export type * as ProjectErrors from './types/errors/projects'
export type * as SecretErrors from './types/errors/secrets'
export type * as WebhookErrors from './types/errors/webhooks'
export { ApiError, ApiResponse } from './http/response'

export type ClientScope = 'workspace' | 'environment'
export type CreateClientOptions =
  | { apiKey: string; scope: 'workspace' }
  | { apiKey: string; scope: 'environment' }

/**
 * Creates an SDK object that encapsulates functionality for managing projects, environments, and secrets.
 *
 * @param apiKey - Service or Personal API key.
 * @returns An object containing methods for interacting with projects, environments, and secrets.
 */
export function createWorkspaceClient(apiKey: string) {
  return new WorkspaceClient(apiKey)
}

/** Client for interacting with Stashbase resources using a workspace API key with a given permissions. */
class WorkspaceClient {
  private client: HttpClient
  public readonly scope: ClientScope = 'workspace'

  constructor(apiKey: string) {
    const client = createHttpClient({
      authorization: { apiKey },
    })

    this.client = client
    this.projects = new ProjectsAPI(this.client)
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
   * Provides access to the Secrets API.
   *
   * @param args - An object with a `project` and `environment` property.
   * @param args.project - The project's name or ID.
   * @param args.environment - The environment's name or ID.
   */
  public secrets(args: { project: string; environment: string }) {
    return new SecretsAPI(this.client, args.project, args.environment)
  }

  /**
   * Searches secrets in a specific project by exact name or value.
   *
   * @param args - Search arguments.
   * @param args.project - The project's name or ID.
   * @returns A promise that resolves to searched secrets or an error response.
   */
  public searchSecrets(args: { project: string } & SearchSecretsOptions) {
    const { project, ...options } = args
    return new SecretsAPI(this.client, project).searchSecrets(options)
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
export function createEnvironmentClient(apiKey: string) {
  return new EnvironmentClient(apiKey)
}

/**
 * Creates an SDK client with explicit scope selection.
 *
 * This factory does not perform network discovery. API key validity and permissions
 * are validated by backend endpoints when requests are made.
 *
 * @param options - Client creation options.
 * @returns A workspace or environment client based on requested scope.
 */
export function createClient(options: { apiKey: string; scope: 'workspace' }): WorkspaceClient
export function createClient(options: { apiKey: string; scope: 'environment' }): EnvironmentClient
export function createClient(options: CreateClientOptions): WorkspaceClient | EnvironmentClient {
  return options.scope === 'environment'
    ? new EnvironmentClient(options.apiKey)
    : new WorkspaceClient(options.apiKey)
}

export { WorkspaceClient, EnvironmentClient, verifyWebhook }
