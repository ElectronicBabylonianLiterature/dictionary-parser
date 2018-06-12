const fs = require('fs')

describe('readCsv', () => {
  const readCsv = require('../lib/readCsv')
  const roots = `lemma1,root1
lemma2,root2`
  const fileName = 'roots.csv'

  it('reads the file', async () => {
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => cb(null, roots))
    await readCsv(fileName)
    expect(fs.readFile).toHaveBeenCalledWith(fileName, 'utf8', jasmine.any(Function))
  })

  it('parses CSV', async () => {
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => cb(null, roots))
    expect(await readCsv(fileName)).toEqual([
      ['lemma1', 'root1'],
      ['lemma2', 'root2']
    ])
  })

  it('returns rejected promise on read error', async () => {
    const raisedError = 'error'
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => cb(raisedError, null))
    await readCsv(fileName)
      .then(fail)
      .catch(error => expect(error).toEqual(raisedError))
  })

  it('returns rejected promise on parse error', async () => {
    const raisedError = jasmine.objectContaining({type: 'Delimiter'})
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => cb(null, 'not valid csv'))
    await readCsv(fileName)
      .then(fail)
      .catch(error => expect(error).toEqual([raisedError]))
  })
})
