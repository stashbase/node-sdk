import { AxiosInstance } from 'axios'
import environmentsAPI from './environments/api'

function projectsAPI(client: AxiosInstance) {
  const environments = environmentsAPI(client)

  function list(): any {
    // TODO:
    return ''
  }

  return {
    list,
    environments,
  }
}

export default projectsAPI
