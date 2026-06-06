import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { config } from 'dotenv'

const env = {
  ...config({ path: './.env' }).parsed,
  ...config({ path: './env' }).parsed,
  ...process.env,
}

const requiredEnvVars = ['VITE_TEST_ENV_API_KEY', 'VITE_TEST_WORKSPACE_API_KEY']
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
