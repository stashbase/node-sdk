export default class Unauthorized extends Error {
  statusCode = 401
  code = 'unauthorized'

  constructor(detail: string = '') {
    super(detail)
  }
}
