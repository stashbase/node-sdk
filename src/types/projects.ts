export interface Project {
  /** The unique identifier of the project. */
  id: string
  /** The datetime when the project was created. */
  createdAt: string
  /** The datetime when the project was last updated. Initially equals `createdAt`. */
  updatedAt: string
  /** The unique name of the project. */
  name: string
  /** The description of the project, can be null. */
  description: string | null
  /** The number of environments associated with the project. */
  environmentCount: number
  /** User project access level, only for personal authentication. */
  accessLevel?: 'full' | 'granted'
}
