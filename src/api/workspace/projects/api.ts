import { invalidProjectNameError } from '../../../errors'
import { HttpClient } from '../../../http/client'
import { ApiError } from '../../../http/response'
import { isValidProjectName } from '../../../utils/inputValidation'
import { CreateProjectData, createProject } from './handlers/create'
import { deleteProject } from './handlers/delete'
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
    if (!isValidProjectName(projectName)) {
      const error = invalidProjectNameError
      return { data: null, error }
    }

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
    const { name } = data
    const valid = isValidProjectName(name)

    if (!valid) {
      const error = invalidProjectNameError
      return { data: null, error }
    }

    return await createProject(httpClient, data)
  }

  /**
   * @summary Remove project
   * @description Project
   * @param key Project name
   * @returns null
   * */
  async function remove(projectName: string) {
    const invalidName = !isValidProjectName(projectName)

    if (invalidName) {
      const error = invalidProjectNameError
      return { data: null, error }
    }

    return await deleteProject(httpClient, projectName)
  }

  return {
    get,
    list,
    create,
    remove,
  }
}
