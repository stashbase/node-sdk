import { ApiError } from '../../http/response'

export type ProjectNotFoundError = ApiError<'project_not_found', undefined>
export type ProjectLimitReachedError = ApiError<'project_limit_reached', undefined>
export type ProjectAlreadyExistsError = ApiError<'project_already_exists', undefined>
