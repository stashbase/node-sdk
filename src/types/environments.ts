import { SecretKey } from './secretKey'

export type LoadEnvironmentOpts = {
  enabled?: boolean
  // printTable?: boolean
  print?: 'key-value' | 'key' | 'none'
  expandRefs?: boolean
}

export type LoadEnvironmentQueryParams = {
  'with-environment': string
  'no-description': 'true'
  // optional
  'expand-refs'?: 'true'
}

export type LoadEnvironmentResponse = {
  environment: {
    name: string
    type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  }
  secrets: Array<{ key: SecretKey; value: string }>
}
