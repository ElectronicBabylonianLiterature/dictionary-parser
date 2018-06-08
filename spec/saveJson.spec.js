const fs = require('fs')

describe('saveJson', () => {
  const saveJson = require('../lib/saveJson')
  const dictionary = [
    {lemma: 'lemma'}
  ]
  const fileName = 'dictionary.json'

  it('saves the file', async () => {
    const expectedDictionary = JSON.stringify(dictionary, null, '\t')
    spyOn(fs, 'writeFile').and.callFake((file, dict, cb) => cb())
    await saveJson(dictionary, fileName)
    expect(fs.writeFile).toHaveBeenCalledWith(fileName, expectedDictionary, jasmine.any(Function))
  })

  it('returns resolved promise on success', async () => {
    spyOn(fs, 'writeFile').and.callFake((file, dict, cb) => cb())
    await saveJson(dictionary, fileName).catch(fail)
  })

  it('returns rejected promise on error', async () => {
    const raisedError = 'error'
    spyOn(fs, 'writeFile').and.callFake((file, dict, cb) => cb(raisedError))
    await saveJson(dictionary, fileName)
      .then(fail)
      .catch(error => expect(error).toEqual(raisedError))
  })
})
