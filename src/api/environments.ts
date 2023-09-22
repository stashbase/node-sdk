import { AxiosInstance } from 'axios'

function environmentsAPI(client: AxiosInstance, accessToken: string) {
  async function list(args: { project: string }) {
    try {
      const response = await client.get<any[]>(`/projects/${args.project}/environments`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  return {
    list,
  }
}

export default environmentsAPI
