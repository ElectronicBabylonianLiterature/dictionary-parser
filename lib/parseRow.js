function parseLemma (rawLemma) {
  return /^\*?(.+?)\*?$/.exec(rawLemma)[1].replace('\\*', '*')
}

module.exports = function parseRow (row) {
  const dictionaryRowRegExp = /^\*\*(.+)\*\*(\s([IV]+))?\s(.*)/
  const lemmaIndex = 1
  const homonymIndex = 3
  const definitionIndex = 4

  const defaultHomonym = 'I'

  const match = dictionaryRowRegExp.exec(row)

  return {
    lemma: parseLemma(match[lemmaIndex]),
    homonym: match[homonymIndex] || defaultHomonym,
    definition: match[definitionIndex],
    source: row
  }
}
