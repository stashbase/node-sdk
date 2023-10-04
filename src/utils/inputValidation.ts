function isAlphanumericWithHyphens(inputString: string): boolean {
  const pattern = /[^a-zA-Z0-9-]/

  return !pattern.test(inputString)
}

const isValidProjectName = (projectName: string) => isAlphanumericWithHyphens(projectName)

//

function isAlphanumericWithHyphensAndUnderscores(inputString: string): boolean {
  const pattern = /[^a-zA-Z0-9-_]/

  return !pattern.test(inputString)
}

const isValidEnvironmentName = (environmentName: string) =>
  isAlphanumericWithHyphensAndUnderscores(environmentName)

export { isValidProjectName }
