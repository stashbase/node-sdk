import {
  invalidProjectName,
  invalidProjectIdentifierError,
  invalidProjectLimitError,
  invalidProjectOrderError,
  invalidProjectPageError,
  invalidProjectSearchError,
  invalidProjectSortByError,
  projectNameUsesIdFormat,
  newProjectNameEqualsOriginal,
  missingPropertiesToUpdateError,
} from '../../../errors'
import { projectDescriptionTooLongError } from '../../../errors/projects'
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
import { updateProject, UpdateProjectData } from './handlers/update'

export class ProjectsAPI {
  private httpClient: HttpClient

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient
  }

  /**
   * Retrieves a single project by its name or id.
   * @param projectNameOrId - The name or id of the project to retrieve.
   * @returns A promise that resolves to the project object or an error response.
   */
  async get(projectNameOrId: string) {
    if (!isValidProjectIdentifier(projectNameOrId)) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
    }

    return await getProject(this.httpClient, projectNameOrId)
  }

  /**
   * Lists all projects, optionally filtered by the provided options.
   * @param options - Optional parameters to filter or paginate the list of projects.
   * @returns A promise that resolves to an array of project objects or an error response.
   */
  async list(options?: ListProjectsOpts) {
    if (options) {
      if (options.page) {
        const page = options.page

        if (page <= 0 || page > 1000 || typeof page !== 'number') {
          const error = invalidProjectPageError
          return responseFailure(error)
        }
      }

      if (options.limit) {
        const limit = options.limit

        if (limit < 2 || limit > 1000 || typeof limit !== 'number') {
          const error = invalidProjectLimitError
          return responseFailure(error)
        }
      }

      if (options.sortBy) {
        const sortBy = options.sortBy

        if (sortBy !== 'name' && sortBy !== 'createdAt' && sortBy !== 'environmentCount') {
          const error = invalidProjectSortByError
          return responseFailure(error)
        }
      }

      if (options.order) {
        const order = options.order

        if (order !== 'asc' && order !== 'desc') {
          const error = invalidProjectOrderError
          return responseFailure(error)
        }
      }

      if (options.search) {
        const search = options.search

        if (!isValidProjectName(search)) {
          const error = invalidProjectSearchError
          return responseFailure(error)
        }
      }
    }

    return await listProjects(this.httpClient, options)
  }

  /**
   * Creates a new project with the provided data.
   * @param data - The data for creating a new project, including the project name.
   * @returns A promise that resolves to the created project object or an error response.
   */
  async create(data: CreateProjectData) {
    const { name } = data
    const valid = isValidProjectName(name)

    if (!valid) {
      const error = invalidProjectName
      return responseFailure(error)
    }

    const nameHasIdFormat = isResourceIdFormat('project', name)

    if (nameHasIdFormat) {
      const error = projectNameUsesIdFormat
      return responseFailure(error)
    }

    if (data.description && data.description.length > 255) {
      const error = projectDescriptionTooLongError
      return responseFailure(error)
    }

    return await createProject(this.httpClient, data)
  }

  /**
   * Updates a project by its name or id.
   * @param args - The arguments for updating a project, including the project name or id.
   * @returns A promise that resolves to null on successful update or an error response.
   */
  async update(projectNameOrId: string, data: UpdateProjectData) {
    const { name, description } = data

    if (data.name === undefined && data.description === undefined) {
      const error = missingPropertiesToUpdateError
      return responseFailure(error)
    }

    const invaliIdentifier = !isValidProjectIdentifier(projectNameOrId)

    if (invaliIdentifier) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
    }

    if (name) {
      if (!isValidProjectName(name)) {
        const error = invalidProjectName
        return responseFailure(error)
      }

      const newNameHasIdFormat = isResourceIdFormat('project', name)

      if (newNameHasIdFormat) {
        const error = projectNameUsesIdFormat
        return responseFailure(error)
      }

      if (!newNameHasIdFormat && name === projectNameOrId) {
        const error = newProjectNameEqualsOriginal
        return responseFailure(error)
      }
    }

    if (description && description.length > 255) {
      const error = projectDescriptionTooLongError
      return responseFailure(error)
    }

    return await updateProject(this.httpClient, projectNameOrId, data)
  }

  /**
   * Deletes a project by its name or id.
   * @param projectNameOrId - The name or id of the project to remove.
   * @returns A promise that resolves to null on successful deletion or an error response.
   */
  async delete(projectNameOrId: string) {
    const invaliIdentifier = !isValidProjectIdentifier(projectNameOrId)

    if (invaliIdentifier) {
      const error = invalidProjectIdentifierError
      return responseFailure(error)
    }

    return await deleteProject(this.httpClient, projectNameOrId)
  }
}
