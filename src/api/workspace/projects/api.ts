import { HttpClient } from '../../../http/client'
import { ApiError } from '../../../http/response'
import { isValidProjectName } from '../../../utils/inputValidation'
import { CreateProjectData, createProject } from './handlers/create'
import { deleteProjects } from './handlers/delete'
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
      // const error: ApiError<'invalid_name_format'> = { code: 'invalid_name_format' }
      const error: ApiError<'invalid_name'> = { code: 'invalid_name' }
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
    console.log({ valid })

    if (!valid) {
      const error: ApiError<'invalid_name'> = { code: 'invalid_name' }

      return { data: null, error }
    }

    return await createProject(httpClient, data)
  }

  /**
   * @summary Remove one or multipe projects
   * @description Project
   * @param key Project names
   * @returns deletedCount, notFound
   * */
  async function remove(names: string[]) {
    if (names.length === 0) {
      const error: ApiError<'invalid_input'> = { code: 'invalid_input' }

      return { data: null, error }
    }

    const invalidName = names.find((name) => !isValidProjectName(name))

    if (invalidName) {
      const error: ApiError<'invalid_name'> = { code: 'invalid_name' }

      return { data: null, error }
    }

    return await deleteProjects(httpClient, names)
  }

  return {
    get,
    list,
    create,
    remove,
  }
}
