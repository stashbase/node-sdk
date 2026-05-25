# Stashbase Node SDK

The official SDK for [Stashbase](https://stashbase.dev), a secrets management platform for developers.

**Features:**

- Manage projects, environments, and secrets from Node.js
- Inject secrets into your process environment
- Simple, promise-based API
- Zero non-development dependencies (security-focused runtime footprint)
- And more...

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

Install with npm or npm compatible package manager (bun, pnpm, etc.).
We recommend using bun for the best experience.

```bash
npm install @stashbase/node-sdk
```

## Usage

For full documentation, please visit [Stashbase Node SDK](https://docs.stashbase.dev/node-sdk).

Here are some common usage examples for the Stashbase Node SDK:

### Auto client

Use `createClient` to create a client with explicit scope selection.

```js
import { createClient } from '@stashbase/node-sdk'

const client = createClient({
  apiKey: process.env.STASHBASE_API_KEY,
  scope: 'workspace', // or "environment"
  timeoutMs: 15000, // optional, hard capped at 120000
  retries: 3, // optional, hard capped at 10
  hooks: {
    beforeRequest: ({ method, url }) => console.log('[request]', method, url),
    afterResponse: ({ response }) => console.log('[response]', response.status),
    onError: ({ error }) => console.error('[error]', error),
  }, // optional
})
console.log(client.scope) // "workspace" or "environment"
```

### Workspace client

Use workspace client to manage resources in a workspace, you can use Service Account or Personal API key.

```js
import { createWorkspaceClient } from '@stashbase/node-sdk'

const client = createWorkspaceClient(process.env.STASHBASE_API_KEY)
console.log(client.scope) // "workspace"
```

```js
const client = createWorkspaceClient(process.env.STASHBASE_API_KEY, {
  timeoutMs: 15000, // optional, hard capped at 120000
  retries: 3, // optional, hard capped at 10
  hooks: {
    beforeRequest: ({ method, url }) => console.log('[request]', method, url),
  }, // optional
})
```

#### List project

```js
const { data, error } = await client.projects.list()
```

#### Create environment

```js
const { data, error } = await client.environments({ project: 'project-name' }).create({
  name: 'api-dev',
  isProduction: false,
})
```

#### Bind workspace context

```js
const ctx = client.withContext({
  project: 'project-name',
  environment: 'dev',
})

const { data, error } = await ctx.secrets.list()
```

#### Get workspace secret metadata

```js
const ctx = client.withContext({
  project: 'project-name',
  environment: 'dev',
})

const { data, error } = await ctx.secrets.getMetadata('HOST')
```

#### List workspace secrets metadata

```js
const ctx = client.withContext({
  project: 'project-name',
  environment: 'dev',
})

const { data, error } = await ctx.secrets.listMetadata()
```

#### Load environment

This method will load the environment and inject the secrets into the process.

```js
// using workspace client
const { error } = await client.environments({ project: 'project-name' }).load('api-dev')
```

### Environment client

Use environment client to manage resources in a specific environment, using Environment Account API key.

```js
import { createEnvironmentClient } from '@stashbase/node-sdk'

const client = createEnvironmentClient(process.env.STASHBASE_ENV_API_KEY)
console.log(client.scope) // "environment"
```

```js
const client = createEnvironmentClient(process.env.STASHBASE_ENV_API_KEY, {
  timeoutMs: 15000, // optional, hard capped at 120000
  retries: 3, // optional, hard capped at 10
  hooks: {
    beforeRequest: ({ method, url }) => console.log('[request]', method, url),
  }, // optional
})
```

### Transport hooks

Hooks can be configured at creation time and updated later at runtime through `client.options.hooks`.

```ts
const client = createWorkspaceClient(process.env.STASHBASE_API_KEY)

client.options.hooks = {
  beforeRequest: ({ method, url }) => console.log('[request]', method, url),
  afterResponse: ({ response }) => console.log('[response]', response.status),
  onError: ({ error }) => console.error('[error]', error),
}
```

Hook behavior contract:
- `beforeRequest`: runs before each request attempt.
- `afterResponse`: runs after receiving a response (including non-2xx).
- `onError`: runs when request processing throws.
- If `beforeRequest` or `afterResponse` throws, request fails with `HookExecutionError` in `response.error`.
- If `onError` throws, that error is ignored and the original request error is preserved.

#### Get environment details

```js
const { data, error } = await client.environment.get()
```

#### Load environment

This method will load the environment and inject the secrets into the process.

```js
const { error } = await client.environment.load()
```

#### List secrets

```js
const { data, error } = await client.secrets.list()
```

#### Get environment secret metadata

```js
const { data, error } = await client.secrets.getMetadata('HOST')
```

#### List environment secrets metadata

```js
const { data, error } = await client.secrets.listMetadata()
```

### Type imports

All public SDK types are exported from the package root.

```ts
import type { Secret, ListSecretsResponse, GenericApiError, SecretErrors } from '@stashbase/node-sdk'
```

## Contributing

Bug fixes, documentation improvements, and library improvements are always welcome.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.


## License

Stashbase Node SDK is licensed under the [MIT License](https://opensource.org/licenses/MIT).
You can find the license in the [LICENSE.txt](LICENSE.txt) file.
