import { createApiClient } from './api/client'
import { ProjectsAPI } from './api/projects'

class EnvEaseSDK {
  private readonly projectsAPI: ProjectsAPI

  constructor(private readonly accessToken: string) {
    const client = createApiClient(accessToken)
    this.projectsAPI = new ProjectsAPI(client)
  }

  get projects(): ProjectsAPI {
    return this.projectsAPI
  }
}

// Usage Example
// const sdk = new EnvEaseSDK('YOUR_ACCESS_TOKEN')
// sdk.projects.list().then((projects) => {
//   console.log('Projects:', projects)
// })
//
export default EnvEaseSDK
