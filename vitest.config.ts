import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __SDK_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.1.0'),
    __SDK_DEV_API_URL__: JSON.stringify(''),
  },
  test: {
    dir: 'tests',
    include: ['unit/**/*.test.ts'],
    testTimeout: 10000,
  },
  server: {
    port: 3000,
  },
})
