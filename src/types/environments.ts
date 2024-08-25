import { SecretKey } from './secretKey'
import { ListSecretsQueryParams } from './secrets'

export type LoadEnvironmentOpts = {
  /** Whether this methid is enabled or not. */
  enabled?: boolean
  /** Specifies how to print the environment variables. */
  print?: 'key-value' | 'key' | 'none'
  /** Expand all referred secrets to their values. */
  expandRefs?: boolean
}

export type LoadEnvironmentQueryParams = ListSecretsQueryParams

export type LoadEnvironmentResponse = {
  environment: {
    /** The name of the environment. */
    name: string
    /** The type of the environment. */
    type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  }

  /** An array of secrets associated with the environment. */
  secrets: Array<{ key: SecretKey; value: string }>
}

export interface Environment {
  /** The unique identifier of the environment. */
  id: string
  /** The creation date of the environment. */
  createdAt: string
  /** The unique name of the environment. */
  name: string
  /** The type of the environment. */
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  /** Whether the environment is locked or not. */
  locked: boolean
  /** The description of the environment. */
  description: string | null
  /** The number of secrets in the environment. */
  secretCount: number
}

export type EnvironmentWithProject = Environment & {
  project: {
    /** The unique identifier of the project. */
    id: string
    /** The name of the project. */
    name: string
  }
}

