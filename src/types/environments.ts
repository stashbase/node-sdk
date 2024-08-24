import { SecretKey } from './secretKey'
import { ListSecretsQueryParams } from './secrets'

export type LoadEnvironmentOpts = {
  enabled?: boolean
  // printTable?: boolean
  print?: 'key-value' | 'key' | 'none'
  expandRefs?: boolean
}

export type LoadEnvironmentQueryParams = ListSecretsQueryParams

export type LoadEnvironmentResponse = {
  environment: {
    name: string
    type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  }
  secrets: Array<{ key: SecretKey; value: string }>
}

export interface Environment {
  id: string
  createdAt: string
  name: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  locked: boolean
  description: string | null
  secretCount: number
}

export type EnvironmentWithProject = Environment & {
  project: {
    id: string
    name: string
  }
}
