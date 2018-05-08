const dictionaryRowRegExp = /^\*\*(.+)\*\*\s*(.*)/
const lemmaIndex = 1
const definitionIndex = 2

function parseLemma (rawLemma) {
  return /^\*?(.+?)\*?$/.exec(rawLemma)[1]
}

module.exports = function parseRow (row) {
  const match = dictionaryRowRegExp.exec(row)
  return {
    lemma: parseLemma(match[lemmaIndex]),
    definition: match[definitionIndex],
    source: row
  }
}
