import { HttpClient } from '../../../http/client'
import { GetSecretArgs, getSecret } from './handlers/get'

export function secretsAPI(httpClient: HttpClient) {
  /**
   * @summary Get secret
   * @description Secrets
   * @param args project, environment name. key;
   * @param options Options (return secrets);
   * @returns Secret object
   * */
  async function get(args: GetSecretArgs) {
    return await getSecret(httpClient, args)
  }

  return {
    get,
  }
}
