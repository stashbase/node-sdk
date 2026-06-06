import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

const env = {
  ...config({ path: './.env' }).parsed,
  ...config({ path: './env' }).parsed,
}

export default defineConfig({
  define: {
    __SDK_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.1.0'),
    __SDK_DEV_API_URL__: JSON.stringify(env.STASHBASE_SDK_DEV_API_URL ?? ''),
  },
  test: {
    dir: 'tests',
    include: ['env/**/*.test.ts', 'workspace/**/*.test.ts'],
    testTimeout: 10000,
    env,
  },
  server: {
    port: 3000,
  },
})
