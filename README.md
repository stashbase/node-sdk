# Stashbase Node SDK

The Stashbase Node SDK is the official SDK for Stashbase, secrets management platform for developers.
You can use this SDK to manage your projects, environments, secrets, etc. in your Node.js application.

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

For full documentation, please visit [Stashbase Node SDK](https://docs.stashbase.com/node-sdk).

Here are some common usage examples for the Stashbase Node SDK:

### Initialize the client

```ts
import { createWorkspaceClient } from '@stashbase/node-sdk'

const client = createWorkspaceClient(process.env.STASHBASE_API_KEY)
```

### List projects

```js
const { data, error } = await client.projects.list()
```

### Create environment

```js
const { data, error } = await client.environments('project-name').create({
  name: 'api-dev',
  isProduction: false,
})
```

### Load environment

This method will load the environment and inject the secrets into the process.

```js
const { error } = await client.environments('project-name').load('api-dev')
```

## License

Stashbase CLI is licensed under the [MIT License](https://opensource.org/licenses/MIT).
You can find the license in the [LICENSE.txt](LICENSE.txt) file.
