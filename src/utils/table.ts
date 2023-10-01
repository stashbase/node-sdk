import Table from 'cli-table3'

export function printSecretsTable(args: {
  secretsObj?: Record<string, string>
  array?: Array<{ key: string; value: string }>
}) {
  const { array, secretsObj } = args

  const table = new Table({
    head: ['Key', 'Value'],
    // colWidths: [40, 40],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  if (secretsObj) {
    for (const [key, value] of Object.entries(secretsObj)) {
      table.push([key, value])
    }
  } else if (array) {
    for (const { key, value } of array) {
      table.push([key, value])
    }
  }

  console.log(table.toString())
}
