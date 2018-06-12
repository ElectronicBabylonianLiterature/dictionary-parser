const fs = require('fs')

const parse = require('../lib/parse')
const addRoots = require('../lib/addRoots')

describe('readDictionary', () => {
  const readDictionary = require('../lib/readDictionary')
  const roots = `lemma,root`
  const rootsFileName = 'roots.csv'
  const dictionary = `**lemma** meaning`
  const dictionaryFileName = 'dictionary.json'

  it('loads files, parses and adds roots', async () => {
    spyOn(fs, 'readFile').and.callFake((file, charset, cb) => {
      switch (file) {
        case rootsFileName:
          cb(null, roots)
          break
        case dictionaryFileName:
          cb(null, dictionary)
          break
        default:
          cb(file, null)
          break
      }
    })

    const expectedDictionary = parse(['**lemma** meaning'])
    expectedDictionary.entries = addRoots(expectedDictionary.entries, [['lemma', 'root']])

    expect(await readDictionary(dictionaryFileName, rootsFileName)).toEqual(expectedDictionary)
  })
})
