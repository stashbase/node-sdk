import Unauthorized from './unauthorized'

export function getCustomError(error: any) {
  if (error instanceof Unauthorized) {
    return error
  }

  return Error('Server Error')
}
