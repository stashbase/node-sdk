import { HttpClient } from '../../http/client'
import { CreateProjectData, createProject } from './handlers/create'
import { getProject } from './handlers/get'
import { ListProjectsOpts, listProjects } from './handlers/list'

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

  /**
   * @summary Retrieve single project
   * @description Project
   * @param projectName Project name
   * @returns Project object
   * */
  async function list(options?: ListProjectsOpts) {
    return await listProjects(httpClient, options)
  }

  /**
   * @summary Create new project
   * @description Project
   * @param data Project input
   * @returns null
   * */
  async function create(data: CreateProjectData) {
    return await createProject(httpClient, data)
  }

  return {
    get,
    list,
    create,
  }
}
