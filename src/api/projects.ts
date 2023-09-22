import { AxiosInstance } from 'axios'
import { EnvironmentsAPI } from './environments'

interface Project {
  id: number
  name: string
  // Other project properties
}

export class ProjectsAPI {
  private _environmentsAPI: EnvironmentsAPI | null = null

  constructor(private readonly client: AxiosInstance) {}

  async list(): Promise<Project[]> {
    try {
      const response = await this.client.get<Project[]>('/projects')
      return response.data
    } catch (error) {
      throw error
    }
  }

  environments(args: { project: string }): EnvironmentsAPI {
    if (!this._environmentsAPI) {
      this._environmentsAPI = new EnvironmentsAPI(this.client, args)
    }
    return this._environmentsAPI
  }
}
