export interface Project {
  /** The unique identifier of the project. */
  id: string
  /** The creation date of the project. */
  createdAt: string
  /** The unique name of the project. */
  name: string
  /** The description of the project, can be null. */
  description: string | null
  /** The number of environments associated with the project. */
  environmentCount: number
}
