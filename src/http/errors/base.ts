import Unauthorized from './unauthorized'
import { ApiError } from '../response'

// export class APIError extends Error {
//   statusCode: number
//   code: string
//
//   constructor(error: Error) {
//     super(error.message)
//     console.log('constructor error: ', error)
//
//     // Initialize the properties with default values
//     this.statusCode = 500 // Default to Internal Server Error
//     this.code = 'internal_error' // Default error code
//
//     // Map specific error classes to custom error properties
//     if (error instanceof Unauthorized) {
//       console.log('Unauthorized error')
//       this.statusCode = 401
//       this.code = 'unauthorized'
//     }
//     // Add more error mappings as needed
//   }
// }
//
// export function createAPIErrorFromResponse(responseData: any) {
//   if (responseData && responseData.error) {
//     console.log('HERE')
//     return new APIError(responseData.error)
//   }
//
//   // If no error data is present, return a default APIError
//   return new APIError({ name: 'sa', message: 'S' })
// }

export function createApiErrorFromResponse(responseData: any): ApiError {
  if (responseData && responseData.error) {
    const err: ApiError = { code: responseData.error.code }
    return err
  }

  // If no error data is present, return a default APIError
  return { code: 'internal_error' }
}
