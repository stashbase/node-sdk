export type OpenErrorCode<TCode extends string> = TCode | (string & {})

export type ApiError<TCode extends string = string> = {
  code: OpenErrorCode<TCode>
  message: string
  details?: unknown
}

export type ResponseSuccess<TData> = {
  ok: true
  data: TData
  error: null
}

export type ResponseFailure<TCode extends string = string> = {
  ok: false
  data: null
  error: ApiError<TCode>
}

export type ApiResponse<TData, TCode extends string = string> =
  | ResponseSuccess<TData>
  | ResponseFailure<TCode>

export const responseSuccess = <TData>(data: TData): ResponseSuccess<TData> => {
  return {
    ok: true,
    data,
    error: null,
  }
}

export const responseFailure = <TCode extends string = string>(
  error: ApiError<TCode>
): ResponseFailure<TCode> => {
  return {
    ok: false,
    data: null,
    error,
  }
}
