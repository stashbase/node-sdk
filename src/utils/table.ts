import Table from 'cli-table3'

export function printLoadedEnvTable(envSecrets: Record<string, string>) {
  const table = new Table({
    head: ['Key', 'Value'],
    // colWidths: [40, 40],
    wordWrap: true,
    style: {
      compact: true,
      head: ['cyan'],
    },
  })

  for (const [key, value] of Object.entries(envSecrets)) {
    table.push([key, value])
  }

  console.log(table.toString())
}
