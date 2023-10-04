function isAlphanumericWithHyphens(inputString: string): boolean {
  const pattern = /[^a-zA-Z0-9-]/

  return !pattern.test(inputString)
}

const isValidProjectName = (projectName: string) => isAlphanumericWithHyphens(projectName)

//

// function isAlphanumericWithHyphensAndUnderscores(inputString: string): boolean {
//   const pattern = /[^a-zA-Z0-9-_]/
//
//   return !pattern.test(inputString)
// }

function isAlphanumericWithUnderscores(inputString: string): boolean {
  const pattern = /[^a-zA-Z0-9_]/

  return !pattern.test(inputString)
}

const isValidEnvironmentName = (environmentName: string) =>
  isAlphanumericWithUnderscores(environmentName)

function isAlphanumericUppercaseWithUnderscore(inputString: string): boolean {
  const pattern = /[^A-Z0-9_]/

  return !pattern.test(inputString)
}

const isValidSecretKey = (key: string) => isAlphanumericUppercaseWithUnderscore(key)

export { isValidProjectName, isValidEnvironmentName, isValidSecretKey }
