function isAlphanumericWithHyphens(inputString: string): boolean {
  const pattern = /[^a-zA-Z0-9-]/

  return !pattern.test(inputString)
}

const isValidProjectName = (projectName: string) => isAlphanumericWithHyphens(projectName)

export { isValidProjectName }
