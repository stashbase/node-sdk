import { ConflictApiError, ResourceApiError } from '.'

export type ProjectNotFoundError = ResourceApiError<'project_not_found', undefined>
export type ProjectLimitReachedError = ResourceApiError<'project_limit_reached', undefined>
export type ProjectAlreadyExistsError = ConflictApiError<'project_already_exists', undefined>
