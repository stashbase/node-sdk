export type ProjectEnvHandlerArgs<T extends Record<string, unknown> | undefined> =
  T extends undefined
    ? {
        project: string
        environment: string
      }
    : { project: string; environment: string } & T
