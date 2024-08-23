export interface PaginationMetadata {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  nextPage: number | null
  prevPage: number | null
}
