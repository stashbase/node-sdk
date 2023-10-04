import { HttpClient } from '../../../http/client'
import { GetSecretArgs, getSecret } from './handlers/get'
import { ListSecretsArgs, ListSecretsOpts, listSecrets } from './handlers/list'

export function secretsAPI(httpClient: HttpClient) {
  /**
   * @summary Get secret
   * @description Secrets
   * @param args project, environment name, key
   * @param options Options (return secrets)
   * @returns Secret object
   * */
  async function get(args: GetSecretArgs) {
    return await getSecret(httpClient, args)
  }
  /**
   * @summary List secrets
   * @description Secrets
   * @param args project, environment name
   * @param options Options (return secrets);
   * @returns Secret object
   * */
  async function list(args: ListSecretsArgs, opts?: ListSecretsOpts) {
    return await listSecrets(httpClient, args, opts)
  }

  return {
    get,
    list,
  }
}
