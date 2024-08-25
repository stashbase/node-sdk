import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

export default defineConfig({
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
