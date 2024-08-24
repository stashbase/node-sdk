import { SecretKey } from './secretKey'

export interface Secret {
  key: Uppercase<string>
  value: string
  description: string | null
}

export type GetSecretResData = Secret
export type ListSecretsResData = Array<Secret>

export interface CreateSecretsResData {
  createdCount: number
  duplicateSecrets: Array<SecretKey>
}

export interface DeleteSecretsResData {
  deletedCount: number
  notFoundSecrets: Array<SecretKey>
}

export interface DeleteAllSecretsResData {
  deletedCount: number
}

export interface SetSecretsResData {
  createdCount: number
  updatedCount: number
}

export interface UpdateSecretsResData {
  updatedCount: number
  notFoundSecrets: Array<SecretKey>
}

export interface ListSecretsQueryParams {
  'expand-refs'?: true
  // comma separated list of properties to return (id, name, type)
  'with-environment'?: string
  // omit?: 'description' | 'value' | 'description,value' | 'value,description'
  omit?: string
  only?: string
  exclude?: string

  // only?: Array<SecretKey>
  // exclude?: Array<SecretKey>
}

export type GetSecretQueryParams = Pick<ListSecretsQueryParams, 'omit' | 'expand-refs'>

export interface GetSecretOptions {
  /**
   * expand all refered secrets to their values
   * */
  expandRefs?: boolean
  /**
   * omit selected secret properties
   * */
  omit?: Array<'value' | 'description'>
}

export type ListSecretsOptions = GetSecretOptions
