// Base workspace type shared across all auth types
type WorkspaceData<R extends boolean> = {
  id: string
  slug: string
  name: string
} & (R extends true ? { userRole: 'MEMBER' | 'ADMIN' | 'OWNER' } : Record<string, never>)

// User authentication type
type AuthedUserData = {
  id: string
  email: string
  name: string
  workspace: WorkspaceData<true>
}

type AuthedUserResponse = {
  type: 'user'
  data: AuthedUserData
}

// Environment account authentication type
type AuthedEnvironmentAccountData = {
  id: string
  name: string
  workspace: WorkspaceData<false>
  project: {
    id: string
    name: string
  }
  environment: {
    id: string
    name: string
  }
  permissions: Record<string, string[]>
}

type AuthedEnvironmentAccountResponse = {
  type: 'environment_account'
  data: AuthedEnvironmentAccountData
}

// Service account authentication type
type AuthedServiceAccountData = {
  id: string
  name: string
  workspace: WorkspaceData<false>
  access: {
    workspace: {
      permissions: Record<string, string[]> | null
      createdProjectPermissions: Record<string, string[]> | null
      createdEnvironmentPermissions: Record<string, string[]> | null
    } | null
    projectCount: number
  } | null
}

type AuthedServiceAccountResponse = {
  type: 'service_account'
  data: AuthedServiceAccountData
}

// The main union type that represents all possible auth responses
type CurrentAuthResponse =
  | AuthedUserResponse
  | AuthedEnvironmentAccountResponse
  | AuthedServiceAccountResponse
