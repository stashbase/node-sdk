import { AxiosInstance } from 'axios'
import { listEnvironments } from './list'

function environmentsAPI(client: AxiosInstance) {
  async function list(args: { project: string }) {
    return await listEnvironments(client, args.project)
  }

  return {
    list,
  }
}

export default environmentsAPI
