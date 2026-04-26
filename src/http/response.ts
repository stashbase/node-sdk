export type OpenErrorCode<TCode extends string> = TCode | (string & {})

export type ApiError<TCode extends string = string> = {
  /** Stable machine-readable error code returned by the API or SDK. */
  code: OpenErrorCode<TCode>
  /** Human-readable error summary. */
  message: string
  /** Optional structured metadata with additional error context. */
  details?: unknown
}

export type ResponseSuccess<TData> = {
  /** Indicates the request completed successfully. */
  ok: true
  /** Parsed response payload for successful requests. */
  data: TData
  /** Always `null` when `ok` is `true`. */
  error: null
  /** HTTP status code when available, otherwise `null` for non-HTTP failures. */
  status: number | null
}

export type ResponseFailure<TCode extends string = string> = {
  /** Indicates the request failed. */
  ok: false
  /** Always `null` when `ok` is `false`. */
  data: null
  /** Structured error object describing why the request failed. */
  error: ApiError<TCode>
  /** HTTP status code when available, otherwise `null` for non-HTTP failures. */
  status: number | null
}

export type ApiResponse<TData, TCode extends string = string> =
  | ResponseSuccess<TData>
  | ResponseFailure<TCode>

export const responseSuccess = <TData>(
  data: TData,
  status: number | null = null
): ResponseSuccess<TData> => {
  return {
    ok: true,
    data,
    error: null,
    status,
  }
}

export const responseFailure = <TCode extends string = string>(
  error: ApiError<TCode>,
  status: number | null = null
): ResponseFailure<TCode> => {
  return {
    ok: false,
    data: null,
    error,
    status,
  }
}
