import {
  invalidNewProjectNameError,
  invalidProjectIdentifierError,
  projectNameCannotUseIdFormat,
} from '../../../errors'
import { HttpClient } from '../../../http/client'
import { responseFailure } from '../../../http/response'
import {
  isResourceIdFormat,
  isValidProjectIdentifier,
  isValidProjectName,
} from '../../../utils/inputValidation'
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
    if (!isValidProjectIdentifier(projectName)) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
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
      const error = invalidNewProjectNameError
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('project', name)

    if (nameHasIdFormat) {
      const error = projectNameCannotUseIdFormat
      return responseFailure(error)
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
    const invaliIdentifier = !isValidProjectIdentifier(projectName)

    if (invaliIdentifier) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
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
