import { AxiosInstance } from 'axios'

export interface Environment {
  id: string
  createdAt: string
  name: string
}

async function listEnvironments(
  client: AxiosInstance,
  projectName: string
): Promise<Environment[]> {
  try {
    const response = await client.get<Environment[]>(`/projects/${projectName}/environments`)
    return response.data
  } catch (error) {
    throw error
  }
}

export { listEnvironments }
