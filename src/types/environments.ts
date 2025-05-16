import { ListSecretsQueryParams, SecretName } from './secrets'

export type LoadEnvironmentOptions = {
  /** Whether this methid is enabled or not. */
  enabled?: boolean
  /** Specifies how to print the environment variables. */
  print?: 'name-value' | 'name' | 'none'
  /** Expand all referred secrets to their values. */
  expandRefs?: boolean
}

export interface ListEnvironmentOptions {
  /** The field to sort by. */
  sortBy?: 'name' | 'createdAt' | 'secretCount'
  /** Whether to sort in ascending or descending order, default: 'asc'. */
  order?: 'asc' | 'desc'
  /** A search query (min 2, max 40 characters). */
  search?: string
}

export type LoadEnvironmentQueryParams = ListSecretsQueryParams

export type LoadEnvironmentResponse = {
  environment: {
    /** The name of the environment. */
    name: string
    /** Whether the environment is a production environment or not. */
    isProduction: boolean
  }

  /** An array of secrets associated with the environment. */
  secrets: Array<{ name: SecretName; value: string }>
}

export interface Environment {
  /** The unique identifier of the environment. */
  id: string
  /** The creation date of the environment. */
  createdAt: string
  /** The unique name of the environment. */
  name: string
  /** Whether the environment is a production environment or not. */
  isProduction: boolean
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

export interface CreateEnvironmentData {
  name: string
  description?: string | null
  isProduction?: boolean
}
