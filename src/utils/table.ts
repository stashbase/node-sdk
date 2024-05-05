import Table from 'cli-table3'

function printKeyValueTable(secrets: Array<{ key: string; value: string }>) {
  const table = new Table({
    head: ['Key', 'Value'],
    // colWidths: [40, 40],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  for (const { key, value } of secrets) {
    table.push([key, value])
  }

  console.log(table.toString())
}

function printKeyTable(secrets: Array<{ key: string; value: string }>) {
  const table = new Table({
    head: ['Key'],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  for (const { key } of secrets) {
    table.push([key])
  }

  console.log(table.toString())
}

export const printSecretsTable = {
  keys: printKeyTable,
  keyValues: printKeyValueTable,
}
