export type GlobalErrorCode =
  | 'auth.unauthorized'
  | 'auth.expired_api_key'
  | 'rate_limit.too_many_requests'
  | 'server.internal_error'
  | 'server.temporary_unavailable'

export type SdkErrorCode = 'server.connection_failed'

export type GenericApiErrorCode = GlobalErrorCode | SdkErrorCode

export type MissingPropertiesToUpdateErrorCode = 'validation.missing_properties_to_update'
export type ProjectNotFoundErrorCode = 'resource.project_not_found'
export type EnvironmentNotFoundErrorCode = 'resource.environment_not_found'

export type ProjectContextErrorCode =
  | GenericApiErrorCode
  | ProjectNotFoundErrorCode
  | 'validation.invalid_project_identifier'

export type EnvironmentContextErrorCode =
  | ProjectContextErrorCode
  | EnvironmentNotFoundErrorCode
  | 'validation.invalid_environment_identifier'
