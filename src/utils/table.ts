import Table from 'cli-table3'

function printMaskedTable(secrets: Array<{ name: string; value: string }>) {
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
    const firstPart = value.slice(0, 3)
    const secondPart = '*'.repeat(6)

    table.push([name, `${firstPart}${secondPart}`])
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
  masked: printMaskedTable,
}
