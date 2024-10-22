import Table from 'cli-table3'

function printNameValueTable(secrets: Array<{ name: string; value: string }>) {
  const table = new Table({
    head: ['Name', 'Value'],
    // colWidths: [40, 40],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  for (const { name, value } of secrets) {
    table.push([name, value])
  }

  console.log(table.toString())
}

function printNameTable(secrets: Array<{ name: string }>) {
  const table = new Table({
    head: ['Name'],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  for (const { name } of secrets) {
    table.push([name])
  }

  console.log(table.toString())
}

export const printSecretsTable = {
  names: printNameTable,
  nameValues: printNameValueTable,
}
