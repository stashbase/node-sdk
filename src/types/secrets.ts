import { SecretKey } from './secretKey'

export interface Secret {
  /** The key of the secret, always in uppercase */
  key: Uppercase<string>
  /** The value of the secret */
  value: string
  /** The description of the secret, can be null */
  description: string | null
}

export type GetSecretResData = Secret
export type ListSecretsResData = Array<Secret>

export interface CreateSecretsResData {
  /** The number of secrets successfully created */
  createdCount: number
  /** An array of secret keys that were duplicates and not created */
  duplicateSecrets: Array<SecretKey>
}

export interface DeleteSecretsResData {
  /** The number of secrets successfully deleted */
  deletedCount: number
  /** An array of secret keys that were not found and thus not deleted */
  notFoundSecrets: Array<SecretKey>
}

export interface DeleteAllSecretsResData {
  /** The total number of secrets deleted */
  deletedCount: number
}

export interface SetSecretsResData {
  /** The number of new secrets created */
  createdCount: number
  /** The number of existing secrets updated */
  updatedCount: number
}

export interface UpdateSecretsResData {
  /** The number of secrets successfully updated */
  updatedCount: number
  /** An array of secret keys that were not found and thus not updated */
  notFoundSecrets: Array<SecretKey>
}

export interface ListSecretsQueryParams {
  /** If true, expands all referenced secrets to their values */
  'expand-refs'?: true
  /** A comma-separated list of environment properties to return (id, name, type) */
  'with-environment'?: string
  /** A string specifying which properties to omit from the response */
  omit?: string
  /** A string specifying which secrets to include in the response */
  only?: string
  /** A string specifying which secrets to exclude from the response */
  exclude?: string

  // only?: Array<SecretKey>
  // exclude?: Array<SecretKey>
}

export type GetSecretQueryParams = Pick<ListSecretsQueryParams, 'omit' | 'expand-refs'>

export interface GetSecretOptions {
  /**
   * Expand all referred secrets to their values
   */
  expandRefs?: boolean
  /**
   * Omit selected secret properties
   */
  omit?: Array<'value' | 'description'>
}

export type ListSecretsOptions = GetSecretOptions

export type ListOnlySecretsOptions = ListSecretsOptions & { only: SecretKey[] }
export type ListExcludeSecretsOptions = ListSecretsOptions & { exclude: SecretKey[] }
