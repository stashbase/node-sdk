/**
 * Interface representing metadata for pagination.
 */
export interface PaginationMetadata {
  /** The current page number. */
  page: number
  /** The maximum number of items per page. */
  limit: number
  /** The total number of items across all pages. */
  totalItems: number
  /** The total number of pages. */
  totalPages: number
  /** The number of the next page, or null if there is no next page. */
  nextPage: number | null
  /** The number of the previous page, or null if there is no previous page. */
  prevPage: number | null
}
