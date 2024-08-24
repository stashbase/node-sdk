import {
  invalidNewProjectNameError,
  invalidProjectIdentifierError,
  projectNameUsesIdFormat,
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
   * Retrieves a single project by its name or id.
   * @param projectNameOrId - The name or id of the project to retrieve.
   * @returns A promise that resolves to the project object or an error response.
   */
  async function get(projectNameOrId: string) {
    if (!isValidProjectIdentifier(projectNameOrId)) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
    }

    return await getProject(httpClient, projectNameOrId)
  }

  /**
   * Lists all projects, optionally filtered by the provided options.
   * @param options - Optional parameters to filter or paginate the list of projects.
   * @returns A promise that resolves to an array of project objects or an error response.
   */
  async function list(options?: ListProjectsOpts) {
    return await listProjects(httpClient, options)
  }

  /**
   * Creates a new project with the provided data.
   * @param data - The data for creating a new project, including the project name.
   * @returns A promise that resolves to the created project object or an error response.
   */
  async function create(data: CreateProjectData) {
    const { name } = data
    const valid = isValidProjectName(name)

    if (!valid) {
      const error = invalidNewProjectNameError
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('project', name)

    if (nameHasIdFormat) {
      const error = projectNameUsesIdFormat
      return responseFailure(error)
    }

    return await createProject(httpClient, data)
  }

  /**
   * Removes a project by its name or id.
   * @param projectNameOrId - The name or id of the project to remove.
   * @returns A promise that resolves to null on successful deletion or an error response.
   */
  async function remove(projectNameOrId: string) {
    const invaliIdentifier = !isValidProjectIdentifier(projectNameOrId)

    if (invaliIdentifier) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
    }

    return await deleteProject(httpClient, projectNameOrId)
  }

  return {
    get,
    list,
    create,
    remove,
  }
}
