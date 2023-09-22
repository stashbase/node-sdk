import { AxiosInstance } from 'axios'
import environmentsAPI from './environments'

function projectsAPI(client: AxiosInstance, accessToken: string) {
  const environments = environmentsAPI(client, accessToken)

  function list(): any {
    //TODO:
    return accessToken
  }

  return {
    list,
    environments,
  }
}

export default projectsAPI
