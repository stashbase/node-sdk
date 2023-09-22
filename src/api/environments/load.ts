import { AxiosInstance } from 'axios'
import dotenvExpand from 'dotenv-expand'

interface Secret {
  key: string
  value: string
}

async function loadEnvironment(
  client: AxiosInstance,
  args: {
    projectName: string
    environmentName: string
    options?: {
      shouldThrow?: boolean
      printTable?: boolean
    }
  }
): Promise<undefined> {
  const { projectName, environmentName, options } = args

  const printTable = options?.printTable
  const shouldThrow = options?.shouldThrow

  try {
    const { data } = await client.get<Array<Secret>>(
      `/projects/${projectName}/environments/${environmentName}/load`
    )

    const resultObject: any = data.reduce((obj: any, item) => {
      obj[item.key] = item.value
      return obj
    }, {})

    const dotenv = {
      parsed: resultObject,
    }

    const obj = dotenvExpand.expand(dotenv)

    if (printTable) {
      console.log(`\nEnvironment: ${environmentName}`)

      console.table(resultObject)
    }
  } catch (error) {
    console.log(error)

    if (shouldThrow) {
      throw error
    }
  }
}

export { loadEnvironment }
