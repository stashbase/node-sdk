const env = process.env

const requireEnv = (name: string): string => {
  const value = env[name]

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required workspace integration env var: ${name}`)
  }

  return value
}

export const workspaceTestConfig = {
  project: requireEnv('VITE_TEST_WORKSPACE_PROJECT'),
  missingProject: requireEnv('VITE_TEST_WORKSPACE_MISSING_PROJECT'),
  environment: requireEnv('VITE_TEST_WORKSPACE_ENVIRONMENT'),
  missingEnvironment: requireEnv('VITE_TEST_WORKSPACE_MISSING_ENVIRONMENT'),
  webhookId: requireEnv('VITE_TEST_WORKSPACE_WEBHOOK_ID'),
  webhookLogId: requireEnv('VITE_TEST_WORKSPACE_WEBHOOK_LOG_ID'),
}
