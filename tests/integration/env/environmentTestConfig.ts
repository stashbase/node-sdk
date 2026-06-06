const env = process.env

const requireEnv = (name: string): string => {
  const value = env[name]

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required environment integration env var: ${name}`)
  }

  return value
}

export const environmentTestConfig = {
  invalidApiKey: requireEnv('VITE_TEST_ENV_INVALID_API_KEY'),
  webhookId: requireEnv('VITE_TEST_ENV_WEBHOOK_ID'),
  webhookLogId: requireEnv('VITE_TEST_ENV_WEBHOOK_LOG_ID'),
  webhookUrl: requireEnv('VITE_TEST_ENV_WEBHOOK_URL'),
  webhookDescription: requireEnv('VITE_TEST_ENV_WEBHOOK_DESCRIPTION'),
}
