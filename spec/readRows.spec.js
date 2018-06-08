const fs = require('fs')

describe('readRows', () => {
  const readRows = require('../lib/readRows')
  const dictionary = `row1
row2`
  const fileName = 'dictionary.json'

  it('reads the file', async () => {
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => cb(null, dictionary))
    await readRows(fileName)
    expect(fs.readFile).toHaveBeenCalledWith(fileName, 'utf8', jasmine.any(Function))
  })

  it('splits by new line', async () => {
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => cb(null, dictionary))
    await readRows(fileName)
      .then(rows => expect(rows).toEqual(['row1', 'row2']))
      .catch(fail)
  })

  it('returns rejected promise on error', async () => {
    const raisedError = 'error'
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => cb(raisedError, null))
    await readRows(fileName)
      .then(fail)
      .catch(error => expect(error).toEqual(raisedError))
  })
})
