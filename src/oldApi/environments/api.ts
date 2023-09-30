import { AxiosInstance } from 'axios'
import { listEnvironments } from './list'
import { loadEnvironment } from './load'

function environmentsAPI(client: AxiosInstance) {
  async function list(args: { project: string }) {
    return await listEnvironments(client, args.project)
  }

  async function load(args: {
    project: string
    environment: string
    options?: { shouldThrow?: boolean; printTable?: boolean }
  }) {
    return await loadEnvironment(client, {
      projectName: args.project,
      environmentName: args.environment,
      options: args.options,
    })
  }

  return {
    list,
    load,
  }
}

export default environmentsAPI
