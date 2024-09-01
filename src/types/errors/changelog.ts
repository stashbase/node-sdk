import { ConflictApiError, GenericApiError, ResourceApiError, ValidationApiError } from '.'

export type ListChangelogError =
  | GenericApiError
  | InvalidChangelogLimitError
  | InvalidChangelogPageError

/** Error when trying to get a changelog change */
export type GetChangelogChangeError =
  | GenericApiError
  | InvalidChangelogChangeIdError
  | ChangeNotFoundError

/** Error when trying to revert a changelog change */
export type RevertChangelogChangeError =
  | GenericApiError
  | InvalidChangelogChangeIdError
  | ChangeNotFoundError
  | ChangeIsCurrentStateError

/** Nothing to revert */
export type ChangeIsCurrentStateError = ConflictApiError<'is_current_state', undefined>

export type InvalidChangelogChangeIdError = ValidationApiError<
  'invalid_change_id',
  {
    exampleChangeId: string
  }
>

/** Invalid limit option */
export type InvalidChangelogLimitError = ValidationApiError<
  'invalid_limit',
  {
    /** Min possbile value for the limit */
    min: number
    /** Max possible value for the limit */
    max: number
    /** Default value for the limit */
    default: number
  }
>

/** Invalid page option */
export type InvalidChangelogPageError = ValidationApiError<
  'invalid_page',
  {
    /** Min possbile value for the limit */
    min: number
    /** Max possible value for the limit */
    max: number
    /** Default value for the limit */
    default: number
  }
>

/** Change with the given ID does not exist */
type ChangeNotFoundError = ResourceApiError<'change_not_found', undefined>
