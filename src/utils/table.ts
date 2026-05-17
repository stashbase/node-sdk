const padRight = (value: string, width: number): string => {
  return value.padEnd(width, ' ')
}

const ANSI_CYAN = '\x1b[36m'
const ANSI_RESET = '\x1b[39m'

const shouldUseColor = () => {
  return process.env.NO_COLOR === undefined
}

const colorHeader = (value: string): string => {
  return shouldUseColor() ? `${ANSI_CYAN}${value}${ANSI_RESET}` : value
}

const createRow = (columns: string[], columnWidths: number[]): string => {
  return columns.map((column, index) => padRight(column, columnWidths[index])).join(' ')
}

const createHeaderRow = (headers: string[], columnWidths: number[]): string => {
  return headers.map((header, index) => colorHeader(padRight(header, columnWidths[index]))).join(' ')
}

const renderTable = (headers: string[], rows: string[][]): string => {
  const columnWidths = headers.map((header, index) => {
    const maxRowLength = rows.reduce((max, row) => Math.max(max, (row[index] ?? '').length), 0)
    return Math.max(header.length, maxRowLength)
  })

  const outputRows = [createHeaderRow(headers, columnWidths)]

  for (const row of rows) {
    outputRows.push(createRow(row, columnWidths))
  }

  return outputRows.join('\n')
}

function printMaskedTable(secrets: Array<{ name: string; value: string }>) {
  const rows = secrets.map(({ name, value }) => {
    const maskedValue = value.length <= 3 ? '*'.repeat(6) : `${value.slice(0, 3)}${'*'.repeat(6)}`
    return [name, maskedValue]
  })

  console.log(renderTable(['Name', 'Value'], rows))
}

function printNameTable(secrets: Array<{ name: string }>) {
  const rows = secrets.map(({ name }) => [name])
  console.log(renderTable(['Name'], rows))
}

export const printSecretsTable = {
  names: printNameTable,
  masked: printMaskedTable,
}
