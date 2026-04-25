export type ApiError<TCode extends string = string> = {
  code: TCode
  message: string
  hint?: string
  details?: unknown
}

export type ApiResponse<TData, TCode extends string = string> = {
  data: TData | null
  error: ApiError<TCode> | null
}

export const responseSuccess = <TData, TCode extends string = string>(
  data: TData
): ApiResponse<TData, TCode> => {
  return {
    data,
    error: null,
  }
}

export const responseFailure = <TData = null, TCode extends string = string>(
  error: ApiError<TCode>
): ApiResponse<TData, TCode> => {
  return {
    data: null,
    error,
  }
}
