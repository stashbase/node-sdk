import { PaginationMetadata } from './pagination'

export interface ListChangelogOptions {
  /** The page number to retrieve. */
  page?: number

  /** The number of items to retrieve per page. */
  limit?: number
}

/**
 * Represents a new secret.
 */
export interface NewSecret {
  /** The new key of the secret. */
  newKey: string
}

/**
 * Represents a new secret with values.
 */
export type NewSecretWithValues = NewSecret & {
  /** The new value of the secret. */
  newValue: string
}

/**
 * Represents an updated secret.
 */
export interface UpdatedSecret {
  /** The key of the updated secret. */
  key: string
}

/**
 * Represents an updated secret with values.
 */
export type UpdatedSecretWithValues = UpdatedSecret & {
  /** The old value of the secret. */
  oldValue: string
  /** The new value of the secret. */
  newValue: string
}

/**
 * Represents a deleted secret change.
 */
export interface DeletedSecret {
  /** The old key of the deleted secret. */
  oldKey: string
}

/**
 * Represents a deleted secret change with values.
 */
export type DeletedSecretWithValues = DeletedSecret & {
  /** The old value of the deleted secret. */
  oldValue: string
}

/**
 * Represents a renamed secret.
 */
export interface RenamedSecret {
  /** The old key of the renamed secret. */
  oldKey: string
  /** The new key of the renamed secret. */
  newKey: string
}

/**
 * Represents a renamed secret with values.
 */
export type RenamedSecretWithValues = RenamedSecret & {
  /** The value of the renamed secret. */
  value: string
}

interface ChangelogItemBase {
  /** The ID of the changelog item. */
  id: string
  /** The creation date of the changelog item. */
  createdAt: Date
  user?: {
    /** The name of the user. */
    name: string
  }
}

/**
 * Represents a changelog item.
 */
export type ChangelogItem = ChangelogItemBase & {
  /** The change details. */
  change: {
    /** The new secrets. */
    new?: NewSecret[]
    /** The renamed secrets. */
    renamed?: RenamedSecret[]
    /** The updated secrets. */
    updated?: UpdatedSecret[]
    /** The deleted secrets. */
    deleted?: DeletedSecret[]
  }
}

/**
 * Represents a changelog item with values.
 */
export type ChangelogItemWithValues = ChangelogItemBase & {
  /** The change details with values. */
  change: {
    /** The new secrets with values. */
    new?: NewSecretWithValues[]
    /** The renamed secrets with values. */
    renamed?: RenamedSecretWithValues[]
    /** The updated secrets with values. */
    updated?: UpdatedSecretWithValues[]
    /** The deleted secrets with values. */
    deleted?: DeletedSecretWithValues[]
  }
}

/**
 * Represents the response for listing changelog items.
 *
 * @template T - A boolean or undefined indicating whether to include values.
 */
export type ListChangelogResponse<T extends boolean | undefined = undefined> = {
  /** The list of changelog items. */
  data: T extends true ? ChangelogItemWithValues[] : ChangelogItem[]
  /** The pagination metadata. */
  pagination: PaginationMetadata
}

export interface RevertChangeResponse {
  /** The ID of the new changelog record. */
  id: string
}
