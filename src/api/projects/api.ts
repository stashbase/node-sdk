import { HttpClient } from '../../http/client'
import { getProject } from './handlers/get'

export function projectsAPI(httpClient: HttpClient) {
  /**
   * @summary Retrieve single project
   * @description Project
   * @param projectName Project name
   * @returns Project object
   * */
  async function get(projectName: string) {
    return await getProject(httpClient, projectName)
  }

  return {
    get,
  }
}
