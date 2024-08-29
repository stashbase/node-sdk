export type ProjectEnvHandlerArgs<T extends Record<string, unknown> | undefined> =
  T extends undefined
    ? {
        project: string
        environment: string
      }
    : { project: string; environment: string } & T

export type SingleWebhookProjectEnvHandlerArgs<T extends Record<string, unknown> | undefined> = {
  /** The ID of the webhook */
  webhookId: string
} & ProjectEnvHandlerArgs<T>

export type SingleWebhookArgs<T extends Record<string, unknown> | undefined> = {
  /** The ID of the webhook */
  webhookId: string
} & T
