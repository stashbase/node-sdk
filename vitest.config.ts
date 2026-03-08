import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

export default defineConfig({
  define: {
    __SDK_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.1.0'),
  },
  test: {
    dir: 'tests',
    testTimeout: 10000,
    env: {
      ...config({ path: './env' }).parsed,
    },
  },
  server: {
    port: 3000,
  },
})
