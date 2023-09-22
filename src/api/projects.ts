import { AxiosInstance } from 'axios'
import { EnvironmentsAPI } from './environments'

function projectsAPI(client: AxiosInstance, accessToken: string) {
  // Define methods that use the project name and access token
  function list(): any {
    return accessToken
    // return listEnvironmentsInternal(client, projectName)
  }

  return {
    list,
  }
}

export default projectsAPI
