import { AtLeastOne } from './util'

export type SecretName = Uppercase<string>

export interface Secret {
  /** The name of the secret, always in uppercase */
  name: Uppercase<string>
  /** The value of the secret */
  value: string
  /** The comment of the secret, can be null */
  comment: string | null
}

export type GetSecretResponse = Secret
export type ListSecretsResponse = Array<Secret>
export type ListSecretsOptions = GetSecretOptions

export interface CreateSecretsResponse {
  /** The number of secrets successfully created */
  createdCount: number
  /** An array of secret names that were duplicates and not created */
  duplicateSecrets: Array<SecretName>
}

export interface DeleteSecretsResponse {
  /** The number of secrets successfully deleted */
  deletedCount: number
  /** An array of secret names that were not found and thus not deleted */
  notFoundSecrets: Array<SecretName>
}

export interface DeleteAllSecretsResponse {
  /** The total number of secrets deleted */
  deletedCount: number
}

export interface SetSecretsResponse {
  /** The number of new secrets created */
  createdCount: number
  /** The number of existing secrets updated */
  updatedCount: number
}

export interface UpdateSecretsResponse {
  /** The number of secrets successfully updated */
  updatedCount: number
  /** An array of secret names that were not found and thus not updated */
  notFoundSecrets: Array<SecretName>
}

export interface ListSecretsQueryParams {
  /** If true, expands all referenced secrets to their values */
  'expand-refs'?: true
  /** A comma-separated list of environment properties to return (id, name, is_production) */
  'with-environment'?: string
  /** A string specifying which properties to omit from the response */
  omit?: string
  /** A string specifying which secrets to include in the response */
  only?: string
  /** A string specifying which secrets to exclude from the response */
  exclude?: string

  // only?: Array<SecretName>
  // exclude?: Array<SecretName>
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
  omit?: Array<'value' | 'comment'>
}

export type CreateSecretsData = Array<CreateSecretsItem>

export type CreateSecretsItem = {
  /** The name of the secret */
  name: SecretName
  /** The value of the secret */
  value: string
  /** The comment of the secret (optional) */
  comment?: string | null
}

export type SetSecretsItem = CreateSecretsItem

export type UpdateSecretsItem = {
  name: SecretName
} & AtLeastOne<{
  newName: SecretName
  value: string
  comment: string | null
}>
