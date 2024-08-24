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
