import Table from 'cli-table3'

function printKeyValueTable(secretsObj: Record<string, string>) {
  const table = new Table({
    head: ['Key', 'Value'],
    // colWidths: [40, 40],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  for (const [key, value] of Object.entries(secretsObj)) {
    table.push([key, value])
  }

  console.log(table.toString())
}

function printKeyTable(secretsObj: Record<string, string>) {
  const table = new Table({
    head: ['Key'],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  for (const [key, _] of Object.entries(secretsObj)) {
    table.push([key])
  }

  console.log(table.toString())
}

export const printSecretsTable = {
  keys: printKeyTable,
  keyValues: printKeyValueTable,
}
