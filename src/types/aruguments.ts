import { HttpClient } from '../http/client'

export type EnvironmentHandlerArgs<T extends Record<string, unknown> | undefined> =
  T extends undefined
    ? {
        client: HttpClient
        project: string
      }
    : { client: HttpClient; project: string } & T

export type SingleEnvironmentHandlerArgs<T extends Record<string, unknown> | undefined> =
  T extends undefined
    ? EnvironmentHandlerArgs<{ environment: string }>
    : { client: HttpClient; project: string; environment: string } & T

export type ProjectEnvHandlerArgs<T extends Record<string, unknown> | undefined> =
  T extends undefined
    ? {
        client: HttpClient
        project: string
        environment: string
      }
    : { client: HttpClient; project: string; environment: string } & T

export type SingleWebhookProjectEnvHandlerArgs<T extends Record<string, unknown> | undefined> = {
  client: HttpClient
  /** The ID of the webhook */
  webhookId: string
} & ProjectEnvHandlerArgs<T>

export type SingleWebhookArgs<T extends Record<string, unknown> | undefined> = {
  /** The ID of the webhook */
  webhookId: string
} & T
