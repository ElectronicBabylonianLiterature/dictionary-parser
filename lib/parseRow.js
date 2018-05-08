const dictionaryRowRegExp = /^\*\*([^*]+)\*\*\s*(.*)/
const lemmaIndex = 1
const definitionIndex = 2

module.exports = function parseRow (row) {
  const match = dictionaryRowRegExp.exec(row)
  return {
    lemma: match[lemmaIndex],
    definition: match[definitionIndex],
    source: row
  }
}
