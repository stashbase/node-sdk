import { assert, describe, test, vi } from 'vitest'
import { printSecretsTable } from '../../src/utils/table'

const stripAnsi = (value: string) => value.replace(/\x1b\[[0-9;]*m/g, '')

describe('printSecretsTable', () => {
  test('prints names table', () => {
    const originalNoColor = process.env.NO_COLOR
    delete process.env.NO_COLOR

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    printSecretsTable.names([{ name: 'API_KEY' }, { name: 'DB_URL' }])

    assert.equal(logSpy.mock.calls.length, 1)
    const output = String(logSpy.mock.calls[0][0])
    logSpy.mockRestore()

    console.log('\nNames Table Output:\n' + output)

    assert.include(output, '\x1b[36m')
    assert.include(output, '\x1b[39m')

    const plainOutput = stripAnsi(output)

    assert.include(plainOutput, 'Name')
    assert.include(plainOutput, 'API_KEY')
    assert.include(plainOutput, 'DB_URL')
    assert.notInclude(plainOutput, '│')

    process.env.NO_COLOR = originalNoColor
  })

  test('prints masked values table', () => {
    const originalNoColor = process.env.NO_COLOR
    delete process.env.NO_COLOR

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    printSecretsTable.masked([
      { name: 'SHORT', value: 'abc' },
      { name: 'LONG', value: 'abcdef' },
    ])

    assert.equal(logSpy.mock.calls.length, 1)
    const output = String(logSpy.mock.calls[0][0])
    logSpy.mockRestore()

    console.log('\nMasked Table Output:\n' + output)

    assert.include(output, '\x1b[36m')
    assert.include(output, '\x1b[39m')

    const plainOutput = stripAnsi(output)

    assert.include(plainOutput, 'Name')
    assert.include(plainOutput, 'Value')
    assert.match(plainOutput, /SHORT\s{3,}\*{6}/)
    assert.match(plainOutput, /LONG\s{3,}abc\*{6}/)
    assert.notInclude(plainOutput, '│')

    process.env.NO_COLOR = originalNoColor
  })
})
