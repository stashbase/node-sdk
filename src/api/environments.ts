import { AxiosInstance } from 'axios'

export class EnvironmentsAPI {
  constructor(
    private readonly client: AxiosInstance,
    private readonly args: { project: string } // Receive the project name
  ) {}

  async list(): Promise<any[]> {
    try {
      const response = await this.client.get<any[]>(`/projects/${this.args.project}/environments`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
