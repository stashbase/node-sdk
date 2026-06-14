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

export interface SecretMetadata {
  name: Uppercase<string>
  comment: string | null
  version: number
  hasValue: boolean
  createdAt: string
  updatedAt: string
  lastAccessedAt: string | null
}

export type GetSecretResponse = Secret
export type ListSecretsResponse = Array<Secret>
export type GetSecretMetadataResponse = SecretMetadata
export type ListSecretsMetadataResponse = {
  secrets: Array<SecretMetadata>
}
export type ListSecretsOptions = GetSecretOptions

export interface CreateSecretsResponse {
  /** The number of secrets successfully created */
  createdCount: number
  /** An array of secret names that were duplicates and not created */
  existingSecrets: Array<SecretName>
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
  expand_refs?: true
  /** A comma-separated list of environment properties to return (id, created_at, name, description, is_production) or boolean for all properties */
  include_environment?: string
  /** A string specifying which properties to omit from the response */
  omit?: string
  /** A string specifying which secrets to include in the response */
  only?: string
  /** A string specifying which secrets to exclude from the response */
  exclude?: string

  // only?: Array<SecretName>
  // exclude?: Array<SecretName>
}

export interface SearchSecretsQueryParams {
  name?: string
  value?: string
  include_value?: true
}

export interface SearchSecretsEnvironment {
  id?: string
  name: string
}

export interface SearchSecretsByNameItem {
  secretValue: string | null
  environments: Array<SearchSecretsEnvironment>
}

export interface SearchSecretsByValueItem {
  secretName: SecretName
  environments: Array<SearchSecretsEnvironment>
}

export type SearchSecretsResponse = Array<SearchSecretsByNameItem> | Array<SearchSecretsByValueItem>

export type SearchSecretsOptions = AtLeastOne<{
  name: SecretName
  value: string
}> & {
  /** Include secret value in the response, for search by name */
  includeValue?: boolean
}

export type GetSecretQueryParams = Pick<ListSecretsQueryParams, 'omit' | 'expand_refs'>

export interface GetSecretOptions {
  /**
   * Expand all referred secrets to their values
   */
  expandRefs?: boolean
  /**
   * Omit selected secret properties
   */
  omit?: Array<'comment'>
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
