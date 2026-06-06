import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { config } from 'dotenv'

const DEFAULT_API_BASE_URL = 'https://api.stashbase.dev'
const SERVER_PROBE_TIMEOUT_MS = 2000

const env = {
  ...config({ path: './.env' }).parsed,
  ...config({ path: './env' }).parsed,
  ...process.env,
}

const requiredEnvVars = [
  'VITE_TEST_ENV_API_KEY',
  'VITE_TEST_ENV_INVALID_API_KEY',
  'VITE_TEST_ENV_WEBHOOK_ID',
  'VITE_TEST_ENV_WEBHOOK_LOG_ID',
  'VITE_TEST_ENV_WEBHOOK_URL',
  'VITE_TEST_ENV_WEBHOOK_DESCRIPTION',
  'VITE_TEST_WORKSPACE_API_KEY',
  'VITE_TEST_WORKSPACE_PROJECT',
  'VITE_TEST_WORKSPACE_MISSING_PROJECT',
  'VITE_TEST_WORKSPACE_ENVIRONMENT',
  'VITE_TEST_WORKSPACE_MISSING_ENVIRONMENT',
  'VITE_TEST_WORKSPACE_WEBHOOK_ID',
  'VITE_TEST_WORKSPACE_WEBHOOK_LOG_ID',
]
const missingEnvVars = requiredEnvVars.filter((name) => {
  const value = env[name]
  return typeof value !== 'string' || value.length === 0
})

if (missingEnvVars.length > 0) {
  console.log(
    `Skipping integration tests: missing required env vars: ${missingEnvVars.join(', ')}`
  )
  process.exit(0)
}

const baseUrl =
  typeof env.STASHBASE_SDK_DEV_API_URL === 'string' && env.STASHBASE_SDK_DEV_API_URL.length > 0
    ? env.STASHBASE_SDK_DEV_API_URL
    : DEFAULT_API_BASE_URL

const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), SERVER_PROBE_TIMEOUT_MS)

try {
  const response = await fetch(baseUrl, {
    method: 'HEAD',
    signal: controller.signal,
  })

  if (!response.ok && response.status >= 500) {
    console.log(
      `Skipping integration tests: backend is reachable but unhealthy at ${baseUrl} (status ${response.status})`
    )
    process.exit(0)
  }
} catch (_error) {
  console.log(`Skipping integration tests: backend is unreachable at ${baseUrl}`)
  process.exit(0)
} finally {
  clearTimeout(timeout)
}

const vitestEntrypoint = resolve('node_modules/vitest/vitest.mjs')
const result = spawnSync(
  process.execPath,
  [vitestEntrypoint, '--config', 'vitest.integration.config.ts', '--run'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ...env,
    },
  }
)

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
