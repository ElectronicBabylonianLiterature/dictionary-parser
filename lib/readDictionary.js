const parse = require('./parse')
const readRows = require('./readRows')
const readCsv = require('./readCsv')
const addRoots = require('./addRoots')

module.exports = async function readDictionary (dictionaryFileName, rootsFileName) {
  const rows = await readRows(dictionaryFileName)
  const roots = await readCsv(rootsFileName)
  const dictionary = parse(rows)
  const addedRoots = addRoots(dictionary.entries, roots)

  return {
    ...dictionary,
    ...addedRoots
  }
}
