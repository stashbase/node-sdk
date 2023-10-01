import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: 'tests',
    testTimeout: 10000,
  },
  server: {
    port: 3000,
  },
})
