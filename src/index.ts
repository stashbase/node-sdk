import environmentsAPI from './api/environments/api'
import { createEnvApiClient } from './api/environments/client'
import { createHttpClient } from './http/client'

// Create an SDK object that encapsulates functionality
// ROOT
export function createEnvEase(accessToken: string) {
  //   const client = (accessToken)
  //
  //   const projects = projectsAPI(client)
  //
  //   return {
  //     projects,
  //   }
}

// only for env with env token
export function createEnvApi(envToken: string) {
  console.log(envToken)
  const client = createHttpClient({ basePath: 'environments', authorization: { envToken } })

  return environmentsAPI(client)
}
