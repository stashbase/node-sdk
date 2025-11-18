# Stashbase Node SDK

The official SDK for [Stashbase](https://stashbase.dev), a secrets management platform for developers.

**Features:**

- Manage projects, environments, and secrets from Node.js
- Inject secrets into your process environment
- Simple, promise-based API
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

### Workspace client

Use workspace client to manage resources in a workspace, you can use Service Account or Personal API key.

```js
import { createWorkspaceClient } from '@stashbase/node-sdk'

const client = createWorkspaceClient(process.env.STASHBASE_API_KEY)
```

#### List project

```js
const { data, error } = await client.projects.list()
```

#### Create environment

```js
const { data, error } = await client.environments('project-name').create({
  name: 'api-dev',
  isProduction: false,
})
```

#### Load environment

This method will load the environment and inject the secrets into the process.

```js
// using workspace client
const { error } = await client.environments('project-name').load('api-dev')
```

### Environment client

Use environment client to manage resources in a specific environment, using Environment Account API key.

```js
import { createEnvironmentClient } from '@stashbase/node-sdk'

const client = createEnvironmentClient(process.env.STASHBASE_ENV_API_KEY)
```

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

## License

Stashbase Node SDK is licensed under the [MIT License](https://opensource.org/licenses/MIT).
You can find the license in the [LICENSE.txt](LICENSE.txt) file.
